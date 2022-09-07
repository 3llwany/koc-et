import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { subjectsDropdownVM } from "app/admin/models/admin/educations";
import { ITeacherDropModel } from "app/admin/models/admin/exam";
import {
  IRowFunctionVM,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { StudentsGroupsService } from "app/admin/services/Admin/studentsGroups.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";

@Component({
  selector: "app-add-student-group",
  templateUrl: "./add-student-group.component.html",
  styleUrls: ["./add-student-group.component.css"],
})
export class AddStudentGroupComponent implements OnInit {
  groupId: number = 0;
  groupName: string;
  EduCompId: any;
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  //teachers: ITeacherDropModel[] = [];
  Teachers: teacherByEduCompId[] = [];
  subjects: subjectsDropdownVM[] = [];
  submitted = false;

  myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authserv: AuthService,
    private router: Router,
    private msg: ToastrService,
    private GeneralService: GeneralService,
    // private toastr: ToastrService,
    private StudentsGroupsService: StudentsGroupsService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.groupId = Number(params.get("groupId"));
      if (this.groupId > 0) {
        this.getGroupById(this.groupId);
      }

      this.functionId = Number(params.get("functionId"));
      //  console.log("functionId", this.functionId);
      if (this.functionId) {
        this.authserv
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
              //  console.log(`RowFunctions for"${this.functionId}": `, res);
            }
          });
      }
    });
  }

  get teacherIdCtrl() {
    return this.myForm.get("teacherUserId");
  }

  get groupNameCtrl() {
    return this.myForm.get("groupName");
  }

  get maxLimitCtrl() {
    return this.myForm.get("maxLimit");
  }

  get subjectIdCtrl() {
    return this.myForm.get("subjectId");
  }

  get currentYearCtrl() {
    return this.myForm.get("currentYear");
  }

  get IdCtrl() {
    return this.myForm.get("Id");
  }

  ngOnInit(): void {
    this.EduCompId = this.authserv.getEduCompId();
    this.myForm = this.fb.group({
      Id: "",
      groupName: ["", Validators.required],
      teacherUserId: ["", Validators.required],
      subjectId: ["", Validators.required],
      maxLimit: ["", Validators.required],
      currentYear: [1, Validators.required],
      EducompId: this.EduCompId,
      Publish: [1],
      IsHidden: [0],
    });
    this.getTeachersByEducompId();
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getTeachersByEducompId();
    });
    // this.authserv.branchId.subscribe((e) => {
    //   this.branchId = e.branchId;
    // });
  }

  getGroupById(groupId: number) {
    this.StudentsGroupsService.getGroupById(groupId).subscribe((res: any) => {
      // console.log("getGroupById", res);
      this.teacherIdCtrl?.setValue(res.teacherId);
      this.getSubjectByTeacherId();
      this.groupId = res.Id;
      this.IdCtrl.setValue(res.Id);
      this.groupName = res?.Name;
      this.groupNameCtrl?.setValue(res.Name);
      this.maxLimitCtrl?.setValue(res.maxLimit);
      this.currentYearCtrl?.setValue(res.currentYear);
      this.subjectIdCtrl.setValue(String(res?.subjectId));
    });
  }

  addStudyingGroup() {
    this.submitted = true;
    // if (this.groupId != null) this.FormCtrls.Id.setValue(this.groupId);
    let valid = this.myForm.valid;
    if (valid) {
      this.spinner.show();
      // console.log("form data", this.myForm.value);
      this.StudentsGroupsService.addStudyingGroup(this.myForm.value).subscribe(
        (res: any) => {
          console.log("group added", res);
          if (res.returnValue == 1) {
            if (this.groupId !== this.IdCtrl?.value)
              this.msg.success("تم إضافة/تعديل المجموعة");
          } else this.msg.error(res.returnString);
          this.spinner.hide();
        }
      );
    }
  }

  OnEdit() {
    if (this.myForm.valid) {
      if (this.groupId > 0) {
        this.myForm.controls["Id"].setValue(this.groupId);
      }
      // console.log("update form values", this.myForm.value);
      this.spinner.show();
      this.StudentsGroupsService.addStudyingGroup(this.myForm.value).subscribe(
        (response: any) => {
          if (response.returnValue == 200 && response.Id > 0) {
            //  console.log("update group", response);
            this.msg.success("تم اضافة/ تعديل الامتحان بنجاح");
            this.submitted = false;
          }
          this.spinner.hide();
        }
      );
    }
  }

  getTeachersByEducompId() {
    this.GeneralService.getTeachersByEducompId(this.EduCompId).subscribe(
      (res: any) => {
        this.Teachers = res.lstTeachers;
        // console.log("lst",this.Teachers);
      }
    );
  }

  getSubjectByTeacherId() {
    if (this.teacherIdCtrl?.value) {
      this.GeneralService.getSubjectByTeacherId(
        this.teacherIdCtrl.value
      ).subscribe((res: any) => {
        // console.log("subject", res);
        this.subjects = res.lsts;
      });
    }
  }
}
