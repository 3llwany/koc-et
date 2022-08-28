import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import {
  IGetMaterialVM,
  lesson,
  teacherBySubEduComp,
  unit,
} from "app/admin/models/admin/educations";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { SubjectsService } from "app/admin/services/Admin/subjects.service";
import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import { IRowFunctionVM } from "app/shared/models/general/general";
import { StudentGroupVM } from "app/admin/models/admin/reservation";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-add-material-main-data",
  templateUrl: "./add-main-data.component.html",
  styleUrls: ["./add-main-data.component.scss"],
})
export class AddMaterialMainDataComponent implements OnInit {
  EduCompId: any;
  branchId: any;
  functionId: number;
  parentId: number;
  rowFunctions: IRowFunctionVM[];
  subjectId: any;
  materialId: any;
  subject_ar_name: string;
  materialName: string;
  myForm!: FormGroup;
  submitted = false;
  Teachers: teacherBySubEduComp[] = [];
  units: unit[];
  Lessons: lesson[];
  groups: StudentGroupVM[];
  getGroupsValue: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private SubjectsService: SubjectsService,
    private SubjectMaterialsService: SubjectMaterialsService,
    public authserv: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.materialId = params.get("materialId");
      this.subjectId = params.get("subjectId");
      this.functionId = Number(params.get("functionId"));
      this.parentId = Number(params.get("parentId"));
      if (this.functionId) {
        this.authserv
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
              console.log("row-Function:", res);
            }
          });
      }
      console.log("materialId:", this.materialId);
      console.log("subjectId:", this.subjectId);
      console.log("functionId:", this.functionId);
      this.getSubjectByID(this.subjectId);
      this.returnSearchedUnitsBySubjectId();
    });
  }

  ngOnInit(): void {
    //get Current EduCompId
    this.EduCompId = this.authserv.getEduCompId();
    this.branchId = this.authserv.getBranchId();
    this.getTeacherByEduCompId();
    this.getGroupsByEduCompId();

    this.myForm = this.fb.group({
      subjectId: [this.subjectId, Validators.required],
      EditedMaterialId: [this.materialId],
      teacherUserId: ["", Validators.required],
      selectedItemType: [1, Validators.required],
      selectedItemId: ["", Validators.required],
      materialName: ["", [Validators.required, CustomeValidator.whiteSpace]],
      onlyCode: [false, Validators.required],
      CustomDiscountApplied: [false, Validators.required],
      CodeIsPurchasable: [false, Validators.required],
      IsOnline: [1, Validators.required],
      num_views: [""], //online
      attachFile: [""],
      studentGroupIDs: [], //ofline
      address: [""], //ofline
      materialPrice: [""], //onlyCode=false
      priceDiscount: [""], //onlyCode=false
      codePrice: [""], //onlyCode=true
      priceDiscountType: ["null", [CustomeValidator.minusNum]],
      fromDate: ["", Validators.required],
      toDate: [""],
      unitId: [""],
      lessonId: [""],
    });
    this.onlyCodeValidators();
  }

  get FormCtrl() {
    return this.myForm.controls;
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getTeacherByEduCompId();
      this.getGroupsByEduCompId();
    });

    this.authserv.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });

    if (this.materialId != null) {
      this.getMaterialById();
    }
  }

  //add Material Form
  addEditMaterial() {
    this.submitted = true;
    let type = this.FormCtrl.selectedItemType?.value;
    let selectedItemId;
    if (type == 1) selectedItemId = this.subjectId;
    else if (type == 2) selectedItemId = this.FormCtrl.unitId?.value;
    else if (type == 3) selectedItemId = this.FormCtrl.lessonId?.value;
    this.FormCtrl.selectedItemId?.setValue(selectedItemId);
    if (
      this.FormCtrl.IsOnline.value == 2 &&
      !this.FormCtrl.studentGroupIDs?.value?.length
    ) {
      this.toastr.warning("Must Choose Group!");
      return;
    }
    if (
      this.FormCtrl.IsOnline.value == 1 &&
      this.FormCtrl.num_views?.value < 0
    ) {
      this.toastr.warning("Must Enter number of views");
      return;
    }
    console.log(this.myForm.value);
    console.log(this.myForm);
    if (this.myForm.valid) {
      this.spinner.show();
      this.SubjectMaterialsService.addEditMaterial(
        this.EduCompId,
        this.branchId,
        this.myForm.value
      ).subscribe((res: any) => {
        if (res.returnValue == 1) {
          //console.log(res);
          if (this.materialId == null) this.toastr.success("تم إضافة المحاضرة");
          else this.toastr.success("تم تعديل المحاضرة");
          this.submitted = false;
          this.materialId = res.Id;
          this.router.navigate([], {
            queryParams: {
              materialId: res.Id,
            },
            queryParamsHandling: "merge",
          });
        }
        this.spinner.hide();
      });
    }
  }

  getMaterialById() {
    this.spinner.show();
    this.SubjectMaterialsService.getMaterialById<IGetMaterialVM>(
      this.subjectId,
      this.materialId
    ).subscribe((res) => {
      //  console.log(res);
      if (res.retunValue == 1) {
        this.myForm.patchValue(res.model);
        this.materialName = res.model.materialName;
        this.FormCtrl.CustomDiscountApplied.setValue(
          res.model.CustomDiscountApplied || false
        );
        if (res.model?.selectedItemType == 2)
          this.FormCtrl.unitId.setValue(res.model.selectedItemId);
        else if (res.model.selectedItemType == 3) {
          //this.returnSearchedLessonsByUnitId()
          this.FormCtrl.lessonId.setValue(res.model.selectedItemId);
        }
      }
      this.spinner.hide();
    });
  }

  //Attache File
  onChange(event: any) {
    let fileName = <File>event.target.files[0].name;
    let fileSize = <File>event.target.files[0].size;
    let fileType = <File>event.target.files[0].type;
    let LastModified = <File>event.target.files[0].lastModified;
    let LastModifiedDate = <File>event.target.files[0].lastModifiedDate;

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        let fileReder = event.target.result;
        let data = {
          FileAsBase64: fileReder,
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        this.FormCtrl.attachFile.setValue(data);
      };
    }
  }

  getGroupsByEduCompId() {
    this.SubjectMaterialsService.getGroupsByEduCompId(this.EduCompId).subscribe(
      (res: any) => {
        if (res.retunValue == 1) {
          this.groups = res.lstEduCompGroups;
        }
      }
    );
  }

  getSubjectByID(id: any) {
    this.SubjectsService.getSubjectByID(id).subscribe((res: any) => {
      if (res.subject_id != null) {
        this.subject_ar_name = res.subject_ar_name;
      }
    });
  }

  getTeacherByEduCompId() {
    this.spinner.show();
    this.SubjectsService.getTeacherBySubjectAndEduCompId(
      this.EduCompId,
      this.subjectId
    ).subscribe((res: any) => {
      if (res.retunValue == 1) {
        this.Teachers = res.teachers;
      }
      this.spinner.hide();
    });
  }

  returnSearchedUnitsBySubjectId() {
    this.SubjectMaterialsService.returnSearchedUnitsBySubjectId<unit[]>(
      this.subjectId
    ).subscribe((res) => {
      this.units = res;
    });
  }

  returnSearchedLessonsByUnitId(unitId: any) {
    this.SubjectMaterialsService.returnSearchedLessonsByUnitId<lesson[]>(
      unitId
    ).subscribe((res) => {
      this.Lessons = res;
    });
  }

  //onlyCode Validators
  onlyCodeValidators() {
    let online = this.FormCtrl.codePrice.value;
    if (online == false) {
      this.FormCtrl.codePrice.reset();
      this.FormCtrl.codePrice.clearValidators();
      this.FormCtrl.materialPrice.setValidators([
        Validators.required,
        CustomeValidator.minusNum,
      ]);
    }

    if (online == true) {
      this.FormCtrl.materialPrice.reset();
      this.FormCtrl.materialPrice.clearValidators();
      this.FormCtrl.codePrice.setValidators([
        Validators.required,
        CustomeValidator.minusNum,
      ]);
    }

    this.FormCtrl.materialPrice.updateValueAndValidity();
    this.FormCtrl.codePrice.updateValueAndValidity();
  }
}
