import { Component, Input, OnInit } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { IMaterialVM } from "app/admin/models/admin/educations";
import { ConfirmDialogComponent } from "app/shared/components/dialogs/confirm-dialog/confirm-dialog.component";
import { AuthService } from "app/shared/services/auth/auth.service";
import {
  IChapterMaterialsVM,
  IChaptersLessonsVM,
  IChaptersSubjectRevisionsVM,
  IChaptersUnitRevisionsVM,
  IPostMaterialListVM,
  ISubjectChaptersVM,
} from "app/student/models/student";
import { MaterialsService } from "app/student/services/materials.service";
import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-offline-lectures",
  templateUrl: "./offline-lectures.component.html",
  styleUrls: ["./offline-lectures.component.scss"],
})
export class OfflineLecturesComponent implements OnInit {
  @Input("teacherSubjectId") teacherSubjectId;
  @Input("subjectId") subjectId;
  @Input("teacherId") teacherId;
  lessonsChapters: IChaptersLessonsVM[] = [];
  unitRevisions: IChaptersUnitRevisionsVM[] = [];
  subjectRevisions: IChaptersSubjectRevisionsVM[] = [];
  lecturesList: IMaterialVM[] = [];
  EduCompList: any = [];
  SubjectName?: string;
  TeacherName?: string;
  ChapterName?: string;
  isChapter: boolean = true;
  constructor(
    private TeacherSubServ: TeacherSubjectsService,
    private MaterialsService: MaterialsService,
    private AuthServ: AuthService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {}
  ngOnInit(): void {
    this.ReturnSubjectChapters();

    this.EduCompList = localStorage.getItem("EduCompList");

    if (localStorage.getItem("EduCompList") == null) {
      this.AuthServ.logout();
      this.toastr.info("تم إنتهاء الجلسة قم بتسجيل الدخول مرة اخري");
    }
  }

  ReturnSubjectChapters() {
    this.isChapter = true;
    this.spinner.show();
    this.TeacherSubServ.ReturnSubjectChapters<ISubjectChaptersVM>({
      id: this.teacherSubjectId,
    }).subscribe((res) => {
      //console.log("Chapters", res);
      this.lessonsChapters = res.lessons;
      this.unitRevisions = res.unitRevisions;
      this.subjectRevisions = res.subjectRevisions;
      this.SubjectName = res.subject_name;
      this.TeacherName = res.teacher_name;
      this.spinner.hide();
    });
  }

  ReturneofflineLectures(id: any, type: any) {
    this.spinner.show();
    this.lecturesList = [];
    this.ChapterName = "";
    let data: IPostMaterialListVM = {
      id: id,
      //teacher: this.teacherId,
      teacherUserId: this.teacherId,
      subject: this.subjectId,
      teacher_subject: this.teacherSubjectId,
      type: type,
    };
    this.TeacherSubServ.ReturneofflineLectures<
      IChapterMaterialsVM,
      IPostMaterialListVM
    >(data).subscribe((res: any) => {
      this.isChapter = false;
      this.lecturesList = res.materialsList;

      //Start: Show Chapter Name In matList
      //Subject
      if (type == 1) {
        let subjectChap = this.subjectRevisions.find(
          (x: any) => x.subject_id === id
        );
        this.ChapterName = subjectChap.subject_ar_name;
      }
      //Units
      else if (type == 2) {
        let unitChap = this.unitRevisions.find((x: any) => x.id === id);
        this.ChapterName = unitChap.unit_ar_name;
      }
      // Lessons
      else if (type == 3) {
        let lessonsChap = this.lessonsChapters.find((x: any) => x.id === id);
        this.ChapterName = lessonsChap.lesson_ar_name;
      }

      this.spinner.hide();
    });
  }

  buyOfflineMaterial(id: any) {
    let confirmed = confirm("تأكيد عمليه الشراء؟");
    if (confirmed) {
      this.MaterialsService.buyOfflineMaterial(id).subscribe((res: any) => {
        let returnValue = res.returnValue;

        if (returnValue == 0) {
          this.toastr.error("You are not student", "خطاء");
        } else if (returnValue == 1) {
          this.toastr.success("تم شراء المحاضره");
          for (let obj of this.lecturesList) {
            if (obj.id == id) obj.Purchased = true;
          }

          let url = `/student/teacher/${this.teacherId}/teacher-subject/${this.teacherSubjectId}/${this.subjectId}/material/${id}`;
          window.open(url, "_blank");
        } else if (returnValue == -1) {
          this.toastr.error("ليس لديك رصيد كافي ", "خطاء");
        } else if (returnValue == -5) {
          this.toastr.info("تم الشراء من قبل", "خطاء");
        } else if (returnValue == -10) {
          this.toastr.error(res.returnString, "خطاء");
        } else {
          this.toastr.error(res.returnString, "خطاء");
        }
      });
    }
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
      if (confirm) this.buyOfflineMaterial(id);
    });
  }
}
