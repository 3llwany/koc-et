import { NgxSpinnerService } from "ngx-spinner";
import { Component, Input, OnInit } from "@angular/core";
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
import { ToastrService } from "ngx-toastr";
import { IMaterialVM } from "app/admin/models/admin/educations";
import { MatDialog } from "@angular/material/dialog";
import { EnterCodeDialogComponent } from "app/shared/components/dialogs/enter-code-dialog/enter-code-dialog.component";
import { ConfirmDialogComponent } from "app/shared/components/dialogs/confirm-dialog/confirm-dialog.component";

@Component({
  selector: "app-videos-lectures",
  templateUrl: "./videos-lectures.component.html",
  styleUrls: ["./videos-lectures.component.scss"],
})
export class VideosLecturesComponent implements OnInit {
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
      this.lessonsChapters = res.lessons;
      this.unitRevisions = res.unitRevisions;
      this.subjectRevisions = res.subjectRevisions;
      this.SubjectName = res.subject_name;
      this.TeacherName = res.teacher_name;
      this.spinner.hide();
    });
  }

  ReturneLecturesList(id: any, type: any) {
    this.spinner.show();
    this.lecturesList = [];
    this.ChapterName = "";
    let data: IPostMaterialListVM = {
      id: id,
      teacherUserId: this.teacherId,
      //teacher: this.teacherId,
      subject: this.subjectId,
      teacher_subject: this.teacherSubjectId,
      type: type,
    };

    this.TeacherSubServ.ReturneLecturesList<
      IChapterMaterialsVM,
      IPostMaterialListVM
    >(data).subscribe((res) => {
      this.isChapter = false;

      this.lecturesList = res.materialsList;
      // console.log("LecturesList", res);
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

  CheckifOfflineMaterialHasOnline(lecId: any, buyType: any) {
    this.spinner.show();
    this.MaterialsService.CheckifOfflineMaterialHasOnline(lecId).subscribe(
      (res: any) => {
        //   console.log("HasOnline", res);
        if (res == true) {
          let confirmed = confirm(
            " لقد قمت بحضور هذه المحاضره في السنتر هل تود الإستمرار؟ "
          );
          if (confirmed) {
            if (buyType == 1) {
              // if buy by Credit
              this.openBuyDialog(lecId);
            } else if (buyType == 2) {
              // if buy by code
              this.openSubscribeDialog(lecId);
            }
          }
        } else {
          if (buyType == 1) {
            // if buy by Credit
            this.openBuyDialog(lecId);
          } else if (buyType == 2) {
            // if buy by code
            this.openSubscribeDialog(lecId);
          }
        }
        this.spinner.hide();
      }
    );
  }

  subscribeMaterial(id: any, code: string) {
    if (code != null) {
      this.spinner.show();
      this.MaterialsService.subscribeMaterial({
        materialId: id,
        code: code,
      }).subscribe((res: any) => {
        //  console.log("subscribeMaterial", res);
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
          this.toastr.error("الكود الذي أدخلته غير صحيح", "خطاء");
        } else if (returnValue == -5) {
          this.toastr.info("تم الشراء من قبل", "خطاء");
        } else if (returnValue == -10) {
          this.toastr.error(res.returnString);
        } else if (returnValue == -55) {
          this.toastr.error(" تم إستخدام الكود من قبل ", "خطاء");
        } else {
          this.toastr.error(res.returnString);
        }
        this.spinner.hide();
      });
    }
  }

  buyMaterialById(id: any) {
    this.spinner.show();
    this.MaterialsService.buyMaterialByCredit(id).subscribe((res: any) => {
      //  console.log("buyMaterialById", res);
      let returnValue = res.returnValue;

      if (returnValue == 0) {
        this.toastr.error("You are not authorized", "Error");
      } else if (returnValue == 1) {
        for (let obj of this.lecturesList) {
          if (obj.id == id) obj.Purchased = true;
        }
        this.toastr.success("تم شراء المحاضره");

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
      this.spinner.hide();
    });
  }

  openSubscribeDialog(id): void {
    const dialogRef = this.dialog.open(EnterCodeDialogComponent, {
      data: {
        title: "labels.ConfirmBuyLecture",
        msg: "labels.PleaceEnerCode",
      },
      minWidth: "20vw",
      minHeight: "20vh",
    });
    dialogRef.afterClosed().subscribe((code) => {
      if (code) this.subscribeMaterial(id, code);
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
      if (confirm) this.buyMaterialById(id);
    });
  }
}
