import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  GeneralDropdownVM,
  IBoughtedMaterialsTeacherVM,
  IRefundLectureVM,
} from "app/admin/models/admin/educations";
import { SearchStudentsService } from "app/admin/services/Admin/searchStudents.service";
import {
  IUserVM,
  IStageDropVM,
  ISubjectByTeacherId,
  IYearDropVM,
} from "app/shared/models/general/general";
import { GeneralService } from "app/shared/services/General/general.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-refund-lecture",
  templateUrl: "./refund-lecture.component.html",
  styleUrls: ["./refund-lecture.component.scss"],
})
export class RefundLectureComponent implements OnInit {
  myForm: FormGroup;
  userId: number;
  user: IUserVM;
  Stages: IStageDropVM[] = [];
  Years: IYearDropVM[] = [];
  Subjects: ISubjectByTeacherId[] = [];
  Teachers: GeneralDropdownVM[] = [];
  Lectures: GeneralDropdownVM[] = [];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private GeneralService: GeneralService,
    private SearchStudentsService: SearchStudentsService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    route.paramMap.subscribe((params) => {
      this.userId = Number(params.get("userId"));
    });
  }

  ngOnInit(): void {
    this.getUserDataRefundLecture();
    this.getEduStagesList();
    this.myForm = this.fb.group({
      userId: ["", [Validators.required]],
      stageId: ["", [Validators.required]],
      yearId: ["", [Validators.required]],
      subjectId: ["", [Validators.required]],
      teacherId: ["", [Validators.required]],
      RefundedLectureId: ["", [Validators.required]],
    });
    this.FormCtrls.userId.setValue(this.userId);
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  getUserDataRefundLecture() {
    this.spinner.show();
    this.SearchStudentsService.getUserDataRefundLecture(this.userId).subscribe(
      (res: any) => {
        if (res.model.userId == this.userId) {
          this.user = res.model.user;
        }
        this.spinner.hide();
      }
    );
  }

  refundLecture() {
    if (this.myForm.valid) {
      this.spinner.show();
      let data: IRefundLectureVM = {
        userId: this.userId,
        RefundedLectureId: this.FormCtrls.RefundedLectureId.value,
      };
      this.SearchStudentsService.refundLecture(data).subscribe((res: any) => {
        if (res.returnString == "Success") {
          this.getUserDataRefundLecture();
          this.myForm.reset();
          this.toastr.success("تم إسترجاع المحاضرة بنجاح");
        } else {
          this.toastr.warning(res.returnString);
        }
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
        IBoughtedMaterialsTeacherVM
      >({
        teacherUserId: teacherId,
        subjectId: this.FormCtrls.subjectId.value,
        notStudent: true,
        studentUserId: this.userId,
      }).subscribe((res: any) => {
        this.Lectures = res;
        // console.log('Materials', res);
      });
    }
  }
}
