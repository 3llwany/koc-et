import { Component, ElementRef, Input, OnInit, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { IExamVM, ITemplateVM } from "app/admin/models/admin/exams";
import { ConfirmDialogComponent } from "app/shared/components/dialogs/confirm-dialog/confirm-dialog.component";
import {
  IChaptersLessonsVM,
  IChaptersUnitRevisionsVM,
  IChaptersSubjectRevisionsVM,
  ISubjectChaptersVM,
  IGetSubjectsExamsVM,
  IPostMaterialListVM,
  IPostExamChapterVM,
} from "app/student/models/student";
import { MaterialsService } from "app/student/services/materials.service";
import { StudentService } from "app/student/services/student.service";
import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-return-subject-exams",
  templateUrl: "./return-subject-exams.component.html",
  styleUrls: ["./return-subject-exams.component.scss"],
})
export class ReturnSubjectExamsComponent implements OnInit {
  // @Input("teacherSubjectId")
  teacherSubjectId: any;
  @Input("subjectId") subjectId;
  @Input("teacherId") teacherId;
  @ViewChild("buyexamBtn", { read: ElementRef }) buyexamBtn: ElementRef;
  @ViewChild("buytemplatebtn", { read: ElementRef }) buytemplatebtn: ElementRef;

  lessonsChapters: IChaptersLessonsVM[] = [];
  unitRevisions: IChaptersUnitRevisionsVM[] = [];
  subjectRevisions: IChaptersSubjectRevisionsVM[] = [];
  ExamsList: IExamVM[];
  templatesList: ITemplateVM[];
  SubjectName?: string;
  TeacherName?: string;
  ChapterName?: string;
  isChapter: boolean = true;

  constructor(
    private TeacherSubServ: TeacherSubjectsService,
    private MaterialsService: MaterialsService,
    private StudentService: StudentService,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    this.route.paramMap.subscribe((params) => {
      this.teacherSubjectId = Number(params.get("teacherSubjectId"));
      this.ReturnSubjectChapters(1);
    });
    // router.events.subscribe((val) => {
    //   // console.log("teacherSubjectId", this.teacherSubjectId);
    //   // console.log(val);
    //   // this.ReturnSubjectChapters(1);
    // });
  }

  ngOnInit(): void {
    this.ReturnSubjectChapters(1);
  }

  ReturnSubjectChapters(type) {
    this.isChapter = true;
    this.spinner.show();
    let data: IPostExamChapterVM = {
      id: this.teacherSubjectId,
      type: type,
      showAll: true,
    };
    this.TeacherSubServ.ReturnSubjectChapters<ISubjectChaptersVM>(
      data
    ).subscribe((res) => {
      this.lessonsChapters = res.lessons;
      this.unitRevisions = res.unitRevisions;
      this.subjectRevisions = res.subjectRevisions;
      this.SubjectName = res.subject_name;
      this.TeacherName = res.teacher_name;
      this.spinner.hide();
    });
  }

  ReturneExamsList(id: any, type: any) {
    this.spinner.show();
    this.templatesList = [];
    this.ExamsList = [];
    this.ChapterName = "";

    let data: IPostMaterialListVM = {
      id: id,
      //teacher: this.teacherId,
      teacherUserId: this.teacherId,
      subject: this.subjectId,
      teacher_subject: this.teacherSubjectId,
      type: type,
    };
    this.TeacherSubServ.ReturneExamsList<IGetSubjectsExamsVM>(data).subscribe(
      (res) => {
        this.isChapter = false;
        this.templatesList = res.templates;
        this.ExamsList = res.examList;

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
      }
    );
  }

  payAmount(amount: any) {
    this.spinner.show();
    this.StudentService.payAmountForDirectPay(amount, this.teacherId).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          window.open(res.returnURL, "target_blank");
        } else {
          this.toastr.error(res.returnString || res.message);
        }
        this.spinner.hide();
      }
    );
  }

  buyTemplate(templet: any) {
    this.spinner.show();
    this.MaterialsService.buyTemplate(templet.Id).subscribe((res: any) => {
      if (res.returnValue == 1) {
        console.log("Exam purchased");
        this.GenerateExamFromTemplate(templet.Id);
      } else if (res.returnValue == 3) {
        this.payAmount(templet.price);
        this.buytemplatebtn.nativeElement.innerText = "دخول";
      } else if (res.returnValue == 0) {
        if (
          res.returnString == "This purchase operation has already been done"
        ) {
          this.GenerateExamFromTemplate(templet.Id);
        } else this.toastr.info(res.returnString, "خطأ");
      } else {
        this.toastr.info(res.returnString, "خطأ");
      }
      this.spinner.hide();
    });
  }

  buyExam(exam: any) {
    this.spinner.show();
    this.MaterialsService.buyExam(exam.id).subscribe((res: any) => {
      if (res.returnValue == 1) {
        console.log("Exam purchased");
        window.open(`/student/exam/${exam.id}`, "_blank");
        // this.router.navigateByUrl(`/student/exam/${exam.id}`);
      } else if (res.returnValue == 0) {
        this.toastr.info(res.returnString, "خطأ");
      } else if (res.returnValue == 3) {
        this.payAmount(exam.price);
        this.buyexamBtn.nativeElement.innerText = "دخول";
      } else {
        this.toastr.info(res.returnString, "خطأ");
      }
      this.spinner.hide();
    });
  }

  ResetExamAsStudent(id: any, StudentRepeatExamCost: any) {
    this.spinner.show();
    this.MaterialsService.ResetExamAsStudent(id).subscribe((res: any) => {
      if (res.returnValue == 1) {
        window.open(`/student/exam/${id}`, "_blank");
        // this.router.navigateByUrl(`/student/exam/${id}`);
        // window.open(`/exam/${id}`);
      } else if (res.returnValue == 0) {
        this.toastr.info(res.returnString, "خطأ");
      }
      this.spinner.hide();
    });
  }

  ResetTemplateAsStudent(id: any, StudentRepeatExamCost: any) {
    this.spinner.show();
    this.MaterialsService.ResetTemplateAsStudent(id).subscribe((res: any) => {
      if (res.returnValue == 1) {
        this.GenerateExamFromTemplate(id);
        // this.router.navigateByUrl(`/student/exam/${id}`);
      } else if (res.returnValue == 0) {
        this.toastr.info(res.returnString, "خطأ");
      }
      this.spinner.hide();
    });
  }

  GenerateExamFromTemplate(templateId: any) {
    this.spinner.show();
    this.StudentService.GenerateExamFromTemplate(templateId).subscribe(
      (res: any) => {
        if ((res.returnValue = 200 && res.examId)) {
          // let url = "exam/Details/Template/" + templateId + "/" + res.examId;
          window.open(
            `/student/exam/${res.examId}?templateId=${templateId}`,
            "_blank"
          );
          // this.router.navigate([`/student/exam/${res.examId}`], {
          //   queryParams: { templateId: templateId },
          // });
        } else {
          this.toastr.error(res.returnString);
        }
        this.spinner.hide();
      }
    );
  }

  openResetDialog(id, Cost, type): void {
    let Data: any = {
      title: "labels.ConfirmResetExam",
      msg: `سوف يتم خصم "${Cost != null ? Cost : 0}"
       جنيهات لإعاده الامتحان،وسيتم حذف الإمتحان السابق بدرجته، وفتح إمتحان جديد؟`,
      btn: "General.Confirm",
    };
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: Data,
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm && type == "resetExam") this.ResetExamAsStudent(id, Cost);
      if (confirm && type == "resetTemplate")
        this.ResetTemplateAsStudent(id, Cost);
    });
  }

  openBuyDialog(exam, type): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "labels.ConfirmBuyExam",
        msg: "labels.ClickBuyToBuyExam",
        btn: "labels.Buy",
      },
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm && type == "Exam") this.buyExam(exam);
      if (confirm && type == "Template") this.buyTemplate(exam);
    });
  }
}
