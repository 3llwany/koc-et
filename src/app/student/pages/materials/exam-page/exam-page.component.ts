import { StudentService } from "app/student/services/student.service";
import { Component, HostListener, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, timer } from "rxjs";
import { NgxSpinnerService } from "ngx-spinner";
import { MatRadioChange } from "@angular/material/radio";
import { MatDialog } from "@angular/material/dialog";
import { SaveExamDialogComponent } from "app/shared/components/dialogs/save-exam-dialog/save-exam-dialog.component";
import { ComponentCanDeactivate } from "app/shared/services/auth/Guards/auth/pending-changes.guard";
@Component({
  selector: "app-exam-page",
  templateUrl: "./exam-page.component.html",
  styleUrls: ["./exam-page.component.scss"],
})
export class ExamPageComponent implements OnInit, ComponentCanDeactivate {
  @HostListener("window:beforeunload", ["$event"])
  canDeactivate(): Observable<boolean> | boolean {
    if (
      this.questionNumber - this.solvedQuestionNumberArr.length >
      this.AnsQuestionNumber.length
    ) {
      return false;
      console.log("False");
    } else return true;
  }

  //Exams Lists
  ExamDetails: any = [];
  ExamGroups: any[] = null;
  solvedQuestionNumberArr: any = []; // previously Solved Question
  AnsQuestionNumber: any = []; // Current Answerd Question
  questionNumber: any; // Number Of Question In Exam
  studentUserId: any;
  examId: any;
  ExamName: any;
  TeacherName: any;
  SubjectName: any;
  examTotalMark: any;
  student_grade: any;
  IsAvaliable: any = true;
  solvedExamStudent_ID: any;
  ExamStarTime: any;
  exam_period_minute?: any = 0;
  isSolviedResultsOff: any;

  // Solved Exam
  isSolved: any = false;
  IsResultAvalable: any;
  showResult: any;
  studentMark: any;
  PointsGained: any;
  examResultTime: any;
  examResultDate: any;
  examDuration: any;

  // Repeate Exam
  repeatable: any;
  repeatableExam_Count: any;

  // Returned Res from submit exam
  solvidResults: any;

  constructor(
    private studentServ: StudentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    public dialog: MatDialog
  ) {
    this.route.paramMap.subscribe((params) => {
      this.examId = params.get("examId");
    });
  }

  ngOnInit(): void {
    this.returnStudentExam(this.examId);
  }

  //#region return Student Exams
  returnStudentExam(examId: any) {
    this.spinner.show();
    this.studentServ.returnStudentExam(examId).subscribe((res: any) => {
      console.log("exam: ", res);

      if (res.returnValue == -5) {
        this.spinner.hide();
        this.returnExamResults(res.examId);
        // this.toastr.warning("تم حل الامتحان مسبقاً");
      } else if (res.returnValue == 505) {
        this.toastr.warning("يجب شراء المحاضرة اولا");
        this.router.navigateByUrl("/home");
        this.spinner.hide();
      } else {
        this.isSolved = false;
        this.ExamGroups = res.exam.groups;
        this.ExamName = res.exam.details.exam_ar_name;
        this.IsAvaliable = res.mv.IsAvailable;
        this.TeacherName = res.teacherName;
        this.SubjectName = res.mv.subject.subject_ar_name;
        this.studentUserId = res.mv.exam_student.studentUserId;
        this.examTotalMark = res.mv.examTotalMark;
        this.exam_period_minute = res.exam.details.exam_period_minute;
        this.solvedExamStudent_ID = res.mv.solvedExamStudent_ID;
        this.student_grade = res.mv.exam_student.student_grade;
        // this.questionNumber = res.exam.groups[0].Heads[0].Questions.length;

        let GL = res.exam.groups.length,
          num = 0; // length of Groups
        for (let k = 0; k < GL; k++) {
          let HL = res.exam.groups[k].Heads.length; // length of Heads
          if (HL != 0) {
            for (let m = 0; m < HL; m++) {
              let QL = res.exam.groups[k].Heads[m].Questions.length; //Length of Questions
              num = num + QL;
            }
          }
          this.questionNumber = num;
        }

        // if  Exam Have Time Run Timer
        if (
          res.exam.details.exam_period_minute != 0 &&
          res.exam.details.exam_period_minute != null
        ) {
          this.timer(res.exam.details.exam_period_minute);
        }

        // get Exam  Start Time
        let currentTime = new Date();
        let hh = currentTime.getHours();
        let mm = currentTime.getMinutes();
        let ss = currentTime.getSeconds();
        this.ExamStarTime = hh + ":" + mm + ":" + ss;

        // If Repeated Exam get number of solved questions
        let j = res.exam.groups[0].Heads[0].Questions.length,
          i;
        for (i = 0; i <= j; i++) {
          if (
            res.exam.groups[0].Heads[0].Questions[i] &&
            res.exam.groups[0].Heads[0].Questions[i].QuestionDetails &&
            res.exam.groups[0].Heads[0].Questions[i].QuestionDetails
              .StudentChoice
          ) {
            if (
              res.exam.groups[0].Heads[0].Questions[i].QuestionDetails
                .StudentChoice.RESULT == "T"
            ) {
              // console.log(i)
              this.solvedQuestionNumberArr.push({ id: i });
            }
          }
          this.spinner.hide();
        }
        this.spinner.hide();
      }
    });
  }
  //#endregion

  //#region return Results Student Exams
  returnExamResults(examId: any) {
    this.spinner.show();
    this.studentServ.returnStudentExamResults(examId).subscribe((res: any) => {
      console.log("resultes: ", res);
      this.isSolved = true;
      this.ExamGroups = res.item.groups;
      this.ExamName = res.item.details.exam_ar_name;
      this.TeacherName = res.teacherName;
      this.SubjectName = res.SubjectName;
      //this.studentId = res.ex.exam_student.student_id;
      //this.IsAvaliable = res.item.details.IsAvaliable;
      this.examTotalMark = res.ex.total_mark;
      this.student_grade = res.ex.exam_student?.student_grade;
      this.studentMark = res.ex.exam_result;
      this.examDuration = res.ex.examDuration;
      this.examResultDate = res.ex.examResultDate;
      this.examResultTime = res.ex.examResultTime;
      this.IsResultAvalable = res.ex.IsResultAvalable;
      this.isSolviedResultsOff = !res.ex.IsResultAvalable;
      this.showResult = res.ex.showResult;
      this.PointsGained = res.ex.PointsGained;
      this.repeatable = res.ex.repeatable;
      this.repeatableExam_Count = res.ex.repeatableExam_Count;

      this.solvidResults = [];
      this.spinner.hide();
      // $('.closeMod').hide();
      // $('#resultsMV').hide();
      // $('.modal-backdrop').removeClass('fade show in');
    });
  }
  //#endregion

  openGroup(groupId: any) {
    // alert(groupId)
  }

  functionName: string = "test";
  test(text: string) {
    alert("test" + text);
  }

  PickedChoiceId;
  radioChange(event: MatRadioChange) {
    this.PickedChoiceId = event.value;
  }

  SingleQuestionForm(questionId: any) {
    // let AnswerText = document.getElementById(
    //   `lab--${this.PickedChoiceId}`
    // ).innerHTML;
    let data = {
      examId: this.examId,
      studentUserId: this.studentUserId,
      PickedChoiceId: this.PickedChoiceId,
      questionId: questionId,
      // AnswerText: AnswerText,
    };
    console.log("SingleQuestion: ", data);
    this.studentServ.SubmitSingleQuestion(data).subscribe((res: any) => {
      console.log(res);

      if (res.returnValue == 200) {
        document.getElementById(`alert-${questionId}`).style.display = "none";
        let element = document.querySelector("#btn-" + questionId);
        element.classList.remove("btn-primary");
        element.classList.add("btn-success");
        element.innerHTML = "تم حفظ الإجابة";
        let ansMsg = document.getElementById(`stu-cho-${questionId}`);
        ansMsg.style.display = "block";
        ansMsg.innerHTML = `تم اختيار الإجابة : ("${res.returnedChoice}")`;

        let founded = this.AnsQuestionNumber.find(
          (x: any) => x.questionId === questionId
        );
        if (!founded) {
          this.AnsQuestionNumber.push({ questionId: questionId });
        }
      }
      if (res.returnValue == 505) {
        document.querySelector("#alert-" + questionId).innerHTML =
          "من فضلك تأكد من إختيار إجابه";
        this.toastr.error("من فضلك تأكد من إختيار إجابه", "خطأ");
      }
    });
  }

  //Submit Exam
  SubmitExam() {
    //let confirmed = confirm('هل انت متأكد من حفظ الإمتحان والخروج؟');
    if (
      this.questionNumber - this.solvedQuestionNumberArr.length >
      this.AnsQuestionNumber.length
    ) {
      let msg =
        ' لم يتم إجابة جميع الاسئله، عدد الاسئله التي لم يتم إجابتها "' +
        (this.questionNumber -
          this.solvedQuestionNumberArr.length -
          this.AnsQuestionNumber.length) +
        '" سؤال';
      this.toastr.error(msg);
    } else {
      this.spinner.show();
      let data = {
        examId: this.examId,
        studentUserId: this.studentUserId,
        solvedExamStudent_ID: this.solvedExamStudent_ID,
        ExamStarTime: this.ExamStarTime,
      };
      this.studentServ.SubmitExam(data).subscribe((res: any) => {
        console.log("submited", res);
        if (res.returnValue == 0) {
          this.toastr.warning(" تم حل الإمتحان من قبل", "خطأ");
          this.spinner.hide();
        } else {
          //console.log(res);
          this.solvidResults = res;
          this.openDialog(res);
          this.spinner.hide();
        }
      });
    }
  }

  // Start Exam Timer
  counter: any;
  timer(Examtime: any) {
    // Exam Timer
    //let countDown: any;
    let time: any = Examtime * 60;
    let counter = time;
    let tick = 1000;

    //this.oberserableTimer()
    let countDown: any = timer(0, tick).subscribe(() => {
      if (counter > 0) {
        if (counter == time / 2) {
          let msg = 'باقي من وقت الإمتحان  " ' + Examtime / 2 + '" دقيقه';
          this.toastr.warning(msg);
        }
        if (counter == time / 4) {
          let msg = 'باقي من وقت الإمتحان  " ' + Examtime / 4 + '" دقيقه';
          this.toastr.warning(msg);
        }
        --counter;
        this.counter = counter;
      } else if (counter == 0) {
        this.toastr.error("تم إنتهاء الوقت ");
        countDown == null;
        counter = null;

        this.spinner.show();
        let data = {
          examId: this.examId,
          studentUserId: this.studentUserId,
          solvedExamStudent_ID: this.solvedExamStudent_ID,
          ExamStarTime: this.ExamStarTime,
        };
        this.studentServ.SubmitExam(data).subscribe((res: any) => {
          if (res.returnValue == 0) {
            this.toastr.error(" تم حل الإمتحان من قبل", "خطأ");
            this.spinner.hide();
          } else {
            // console.log(res);
            this.solvidResults = res;
            this.openDialog(res);
            this.spinner.hide();
          }
        });
      }
    });
  }

  openDialog(solvidResults): void {
    const dialogRef = this.dialog.open(SaveExamDialogComponent, {
      data: {
        solvidResults: solvidResults,
      },
    });
    dialogRef.afterClosed().subscribe((repeatable) => {
      if (repeatable) this.refresh();
      else this.router.navigateByUrl(`/home`);
    });
  }
  // Refresh Page
  refresh() {
    window.location.reload();
  }
}
