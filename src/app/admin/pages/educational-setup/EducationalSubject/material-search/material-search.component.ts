import { ISearchMaterialVM } from "./../../../../models/admin/educations";
import { environment } from "./../../../../../../environments/environment";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  teacherBySubEduComp,
  unit,
  lesson,
  IMaterialVM,
} from "app/admin/models/admin/educations";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import { SubjectsService } from "app/admin/services/Admin/subjects.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { NgxSpinnerService } from "ngx-spinner";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { IRowFunctionVM } from "app/shared/models/general/general";

@Component({
  selector: "app-material-search",
  templateUrl: "./material-search.component.html",
  styleUrls: ["./material-search.component.scss"],
})
export class MaterialSearchComponent implements OnInit {
  subjectId: any;
  EduCompId: any;
  subject_ar_name: any;
  materialId: any;
  Teachers: teacherBySubEduComp[];
  units: unit[];
  Lessons: lesson[];
  materialsList: IMaterialVM[];
  checked = 1;
  updatePublish = false;
  showMaterial?: string;

  myForm!: FormGroup;
  submitted = false;
  totalItems: any;

  branchId: any;
  functionId: number;
  parentId: number;
  rowFunctions: IRowFunctionVM[];

  displayedColumns: string[] = [
    "#",
    "lecName",
    "price",
    "type",
    "publish",
    "actions",
  ];
  dataSource: MatTableDataSource<IMaterialVM>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private SubjectsService: SubjectsService,
    private SubjectMaterialsService: SubjectMaterialsService,
    private authserv: AuthService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {
    this.route.paramMap.subscribe((params) => {
      this.subjectId = params.get("subjectId");
    });
    route.queryParamMap.subscribe((params) => {
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
    });
  }

  ngOnInit(): void {
    //get Current EduCompId
    this.EduCompId = this.authserv.getEduCompId();
    this.branchId = this.authserv.getBranchId();

    this.myForm = this.fb.group({
      searchedTeacherId: ["", Validators.required],
      searchedItemType: [1, Validators.required],
      subjectId: [this.subjectId],
      unitId: [""],
      lessonId: [""],
    });

    this.getTeacherByEduCompId();
    this.returnSearchedUnitsBySubjectId();
    this.getSubjectByID(this.subjectId);
  }

  get FomCtrls() {
    return this.myForm.controls;
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.FomCtrls?.select_Education_Component.setValue(e.EduCompId);
      this.getTeacherByEduCompId();
    });

    this.authserv.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  searcheMaterial() {
    let type = this.FomCtrls?.searchedItemType?.value;
    let searchedItemId;
    if (type == 1) searchedItemId = this.subjectId;
    if (type == 2) searchedItemId = this.FomCtrls?.unitId?.value;
    if (type == 3) searchedItemId = this.FomCtrls?.lessonId?.value;
    if (
      searchedItemId == null ||
      searchedItemId == "" ||
      this.FomCtrls?.searchedTeacherId.value == ""
    ) {
      this.toastr.error("تأكد من إدخال بيانات صحيحة", "خطأ");
      return;
    }

    if (this.myForm.valid) {
      this.spinner.show();
      let data: ISearchMaterialVM = {
        p: 1,
        searchedItemId: searchedItemId,
        searchedItemType: this.FomCtrls?.searchedItemType?.value,
        searchedTeacherId: this.FomCtrls?.searchedTeacherId.value,
      };
      this.SubjectMaterialsService.searcheMaterial<IMaterialVM[]>(
        data
      ).subscribe((res) => {
        this.materialsList = res;
        this.dataSource = new MatTableDataSource(res);
        this.spinner.hide();
      });
    }
  }

  deleteMaterial(material: IMaterialVM) {
    this.spinner.show();
    this.SubjectMaterialsService.deleteMaterial(material.id).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          let i = this.dataSource.data.findIndex((e) => e === material);
          this.dataSource.data.splice(i, 1);
          this.dataSource.paginator = this.paginator;
          this.toastr.success("تم الحذف");
        }
        if (res.returnValue == 0) {
          this.toastr.error(res.errorMsg, "Error");
        }
        this.spinner.hide();
      }
    );
  }

  openDeleateDialog(material: IMaterialVM): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: material.material_name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.deleteMaterial(material);
      });
  }

  // Publish Depublishh Material
  publishMaterial(MaterialId: any) {
    this.spinner.show();
    this.SubjectMaterialsService.publishMaterial(MaterialId).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          for (const obj of this.materialsList) {
            if (obj.id === MaterialId) {
              obj.IsPublish = !obj.IsPublish;
              break;
            }
          }
        } else if (res.returnValue == 0) {
          this.toastr.error(res.errorMsg);
        }
        this.spinner.hide();
      }
    );
  }

  // Publish Depublishh Material
  showVideoByMaterialId(MaterialId: any) {
    this.SubjectMaterialsService.showVideoByMaterialId(MaterialId).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          this.showMaterial = res.material.attach_path;
          // $("#VideoPreviewModal").show();
        }
      }
    );
  }

  dawnloadLectureAttendees(materialId: any) {
    this.spinner.show();
    this.SubjectMaterialsService.dawnloadLectureAttendees(materialId).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          window.open(
            environment.apiURL.replace("/api/", "") + res.path,
            "_blank"
          );
        }
        this.spinner.hide();
      }
    );
    //let url = `${environment.apiURL}MaterialsAttach/offline-lecture-attendees/${materialId}`;
    //  window.open(url, "_target");
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

  getSubjectByID(id: any) {
    this.SubjectsService.getSubjectByID(id).subscribe((res: any) => {
      if (res.subject_id != null) {
        this.subject_ar_name = res.subject_ar_name;
      }
    });
  }
}
