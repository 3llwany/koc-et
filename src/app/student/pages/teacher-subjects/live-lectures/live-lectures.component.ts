import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { ConfirmDialogComponent } from "app/shared/components/dialogs/confirm-dialog/confirm-dialog.component";
import {
  IGetLiveLectureVM,
  ILiveLectureVM,
  IPostLiveLectureVM,
} from "app/student/models/student";
import { MaterialsService } from "app/student/services/materials.service";
import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-live-lectures",
  templateUrl: "./live-lectures.component.html",
  styleUrls: ["./live-lectures.component.scss"],
})
export class LiveLecturesComponent implements OnInit {
  @Input("teacherSubjectId") teacherSubjectId;
  @Input("subjectId") subjectId;
  @Input("teacherId") teacherId;
  LiveLectures: ILiveLectureVM[] = [];
  SubjectName?: string;
  TeacherName?: string;
  ChapterName?: string;
  constructor(
    private TeacherSubServ: TeacherSubjectsService,
    private route: ActivatedRoute,
    private MaterialsService: MaterialsService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.ReturnLiveLectures(
      this.teacherId,
      this.subjectId,
      this.teacherSubjectId
    );
  }

  ReturnLiveLectures(
    teacherId: number,
    subjectId: number,
    teacherSubjectId: number
  ) {
    this.spinner.show();
    let data: IPostLiveLectureVM = {
      studentId: 38449,
      teacherId: teacherId,
      subjectId: subjectId,
      teacherSubjectId: teacherSubjectId,
    };
    this.TeacherSubServ.ReturnLiveLectures<IGetLiveLectureVM>(data).subscribe(
      (res) => {
        this.LiveLectures = res.List;
        this.spinner.hide();
      }
    );
  }

  bookLecture(id: any) {
    this.spinner.show();
    this.MaterialsService.bookLecture(id).subscribe((res: any) => {
      if (res.Id) {
        //$(`#book-${id}`).hide();
        // $(`#Enter-${id}`).show();
        this.ReturnLiveLectures(
          this.teacherId,
          this.subjectId,
          this.teacherSubjectId
        );
        this.toaster.success("تم حجز المحاضرة");
      } else if (res.returnValue) {
        if (res.returnString == "Not enough credit") {
          this.toaster.error("رصيدك غير كافي لحجز المحاضرة", "خطأ");
        } else if (res.returnString == "Lecture no longer available") {
          this.toaster.error("المحاضرة غير متاحة حالياً", "خطأ");
        } else if (res.returnString == "Lecture reached max limit") {
          this.toaster.error(
            "لا يمكن حجز المحاضرة، تم الوصول للعدد المسموح",
            "خطأ"
          );
        } else if (res.returnString == "Lecture already booked") {
          this.toaster.error("تم حجز المحاضرة من قبل", "خطأ");
        } else {
          this.toaster.error(res.returnString, "خطأ");
        }
      }
      this.spinner.hide();
    });
  }

  openBuyDialog(id): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "labels.ConfirmBuyLecture",
        msg: "labels.ClickBuyToBuyLecture",
        btn: "labels.Buy",
      },
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) this.bookLecture(id);
    });
  }

  openLecture(id: any) {
    window.open(
      "https://zoom.us/wc/join" + id,
      "_blank",
      "location=yes,height=600,width=800,scrollbars=yes,status=yes"
    );
  }
}
