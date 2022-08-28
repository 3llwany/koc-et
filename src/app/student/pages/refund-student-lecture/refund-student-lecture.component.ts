import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  GeneralDropdownVM,
  IBoughtedMaterialsTeacherStudentVM,
} from "app/admin/models/admin/educations";
import {
  IStageDropVM,
  ISubjectByTeacherId,
  IUserVM,
  IYearDropVM,
} from "app/shared/models/general/general";
import { GeneralService } from "app/shared/services/General/general.service";
import { StudentService } from "app/student/services/student.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-refund-student-lecture",
  templateUrl: "./refund-student-lecture.component.html",
  styleUrls: ["./refund-student-lecture.component.scss"],
})
export class RefundStudentLectureComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  user: IUserVM;
  Stages: IStageDropVM[] = [];
  Years: IYearDropVM[] = [];
  Subjects: ISubjectByTeacherId[] = [];
  Teachers: GeneralDropdownVM[] = [];
  Lectures: GeneralDropdownVM[] = [];
  constructor(
    private GeneralService: GeneralService,
    private studentServ: StudentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.returnProfile();
    this.getEduStagesList();
    this.myForm = this.fb.group({
      stageId: ["", [Validators.required]],
      yearId: ["", [Validators.required]],
      subjectId: ["", [Validators.required]],
      teacherId: ["", [Validators.required]],
      RefundedLectureId: ["", [Validators.required]],
    });
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  returnProfile() {
    this.spinner.show();
    this.GeneralService.returnProfile().subscribe((res: any) => {
      this.user = res.user;
      this.spinner.hide();
    });
  }

  refundLecture() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.spinner.show();
      this.studentServ
        .refundLecture(this.FormCtrls.RefundedLectureId.value)
        .subscribe((res: any) => {
          console.log(res);
          if (res.returnValue == 200) {
            this.toastr.success("تم إسترجاع المحاضرة بنجاح");
            this.returnProfile();
          } else if (res.returnValue == 505) {
            this.toastr.error("لا يمكن إسترجاع هذه المحاضره");
          }
          this.submitted = false;
          this.spinner.hide();
        });
    }
  }

  getEduStagesList() {
    this.GeneralService.getAllEduStagesList<IStageDropVM[]>().subscribe(
      (res) => {
        this.Stages = res;
      }
    );
  }

  getEduYearByStageId(stageId: any) {
    this.Years = [];
    this.Subjects = [];
    this.Teachers = [];
    this.Lectures = [];
    this.FormCtrls.yearId.setValue("");
    this.FormCtrls.subjectId.setValue("");
    this.FormCtrls.teacherId.setValue("");
    this.FormCtrls.RefundedLectureId.setValue("");
    if (stageId) {
      this.GeneralService.getEduYearByStageId<IYearDropVM[]>(stageId).subscribe(
        (res) => {
          this.Years = res;
        }
      );
    }
  }

  getSubjectsByYearId(YearId: any) {
    this.Subjects = [];
    this.Teachers = [];
    this.Lectures = [];
    this.FormCtrls.subjectId.setValue("");
    this.FormCtrls.teacherId.setValue("");
    this.FormCtrls.RefundedLectureId.setValue("");
    if (YearId) {
      this.GeneralService.getSubjectsByYearId<ISubjectByTeacherId[]>(
        YearId
      ).subscribe((res) => {
        this.Subjects = res;
        //console.log(res)
      });
    }
  }

  getTeachersBySubId(subjectId: any) {
    this.Teachers = [];
    this.Lectures = [];
    this.FormCtrls.teacherId.setValue("");
    this.FormCtrls.RefundedLectureId.setValue("");
    if (subjectId) {
      this.GeneralService.getTeachersBySubjectId<GeneralDropdownVM[]>(
        subjectId
      ).subscribe((res) => {
        this.Teachers = res;
        //console.log(res)
      });
    }
  }

  getUserBoughtedMaterials(teacherId: any) {
    this.Lectures = [];
    this.FormCtrls.RefundedLectureId.setValue("");
    if (teacherId) {
      this.GeneralService.getUserBoughtedMaterials<
        GeneralDropdownVM[],
        IBoughtedMaterialsTeacherStudentVM
      >({
        teacherUserId: teacherId,
        subjectId: this.FormCtrls.subjectId.value,
      }).subscribe((res: any) => {
        this.Lectures = res;
        // console.log('Materials', res);
      });
    }
  }
}
