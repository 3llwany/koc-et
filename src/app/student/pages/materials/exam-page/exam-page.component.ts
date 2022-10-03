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
import {
  IExamGroupsVM,
  IExamQuestionsVM,
  IPickedChoiceIdVM,
} from "app/admin/models/admin/exam";
import { TranslateService } from "@ngx-translate/core";
declare function changeStyle(): any;
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
      this.AnswerdQuestionsNumber.length
    ) {
      return false;
    } else return true;
  }

  //Exams Lists
  ExamDetails: any = [];
  ExamGroups: IExamGroupsVM[] = null;
  solvedQuestionNumberArr: any = []; // previously Solved Question
  AnswerdQuestionsNumber: any = []; // Current Answerd Question
  AnswerdGroups: any = []; // Current Answerd Question
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
  currentGroupId: number = null;
  constructor(
    private studentServ: StudentService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private translate: TranslateService,
    public dialog: MatDialog
  ) {
    this.route.paramMap.subscribe((params) => {
      this.examId = params.get("examId");
    });
    sessionStorage.setItem("currentLang", "en");
    this.translate.use("en");
    changeStyle();
  }

  ngOnInit(): void {
    this.returnStudentExam(this.examId);
  }

  onSelectGroup(groupId: number) {
    this.currentGroupId = groupId;
  }

  returnStudentExam(examId: any) {
    this.spinner.show();
    this.studentServ.returnStudentExam(examId).subscribe((res: any) => {
      // console.log("exam: ", res);
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
        this.currentGroupId = res.exam.groups[0].GroupId;
        this.ExamName = res.exam.details.exam_ar_name;
        this.IsAvaliable = res.mv.IsAvailable;
        this.TeacherName = res.teacherName;
        this.SubjectName = res.mv.subject.subject_ar_name;
        this.studentUserId = res.mv.exam_student.studentUserId;
        this.examTotalMark = res.mv.examTotalMark;
        this.exam_period_minute = res.exam.details.exam_period_minute;
        this.solvedExamStudent_ID = res.mv.solvedExamStudent_ID;
        this.student_grade = res.mv.exam_student.student_grade;

        let GL = res.exam.groups.length, // length of Groups
          num = 0;
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

        res.exam.groups.forEach((group, index) => {
          group.Heads.forEach((head) => {
            head.Questions.forEach((question) => {
              if (question.QuestionDetails.StudentChoice?.RESULT == "T") {
                this.solvedQuestionNumberArr.push({ id: index });
                this.AnswerdGroups.push(group.GroupId);
              }
            });
          });
        });

        this.spinner.hide();
      }
    });
  }

  // Exam Results
  returnExamResults(examId: any) {
    this.spinner.show();
    this.studentServ.returnStudentExamResults(examId).subscribe((res: any) => {
      // console.log("resultes: ", res);
      this.isSolved = true;
      this.ExamGroups = res.item.groups;
      this.currentGroupId = res.item.groups[0].GroupId;
      this.ExamName = res.item.details.exam_ar_name;
      this.TeacherName = res.teacherName;
      this.SubjectName = res.SubjectName;
      //this.studentId = res.ex.exam_student.student_id;
      this.IsAvaliable = res.item.details.IsAvaliable;
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

  /*
  PickedChoiceId: IPickedChoiceIdVM[] = [];
  onRadioChange(Studentanswer: number, question: IExamQuestionsVM) {
    // console.log("Studentanswer", Studentanswer);

    let answer: IPickedChoiceIdVM = {
      questionId: question.QuestionDetails.questionId,
      choiceId: Number(
        Studentanswer > 0 && Studentanswer <= question.MCQ?.length + 1
          ? question.MCQ[Studentanswer - 1]?.Id || null
          : null
      ),
    };

    let questionIndex: any = this.PickedChoiceId.findIndex(
      (e) => e.questionId === question?.QuestionDetails?.questionId
    );

    if (questionIndex >= 0) this.PickedChoiceId[questionIndex] = answer;
    else this.PickedChoiceId.push(answer);

    // console.log("questionIndex", questionIndex);
    // console.log("answer=>:  ", answer);
    // console.log("questionId=>:  ", question?.QuestionDetails?.questionId);
    // console.log("PickedChoiceId", this.PickedChoiceId);
  }

  SingleQuestionForm(questionId: any) {
    let answer = this.PickedChoiceId.find((e) => e.questionId === questionId);
    // console.log("answerFromSigleQ", answer);
    if (
      answer?.choiceId == null ||
      answer?.choiceId == undefined ||
      answer?.choiceId == 0
    ) {
      this.toastr.warning("من فضلك اختر إجابة");
      return;
    } else {
      let data = {
        examId: this.examId,
        studentUserId: this.studentUserId,
        PickedChoiceId: answer.choiceId,
        questionId: questionId,
        // AnswerText: AnswerText,
      };

      // console.log("SingleQuestionData: ", data);
      this.studentServ.SubmitSingleQuestion(data).subscribe((res: any) => {
        //  console.log("SubmitSingleQuestion", res);

        if (res.returnValue == 200) {
          //this.PickedChoiceId = null;
          document.getElementById(`alert-${questionId}`).style.display = "none";
          let element = document.querySelector("#btn-" + questionId);
          element.classList.remove("btn-primary");
          element.classList.add("btn-success");
          element.innerHTML = "تم حفظ الإجابة";
          let ansMsg = document.getElementById(`stu-cho-${questionId}`);
          ansMsg.style.display = "block";
          ansMsg.innerHTML = `تم اختيار الإجابة : ("${res.returnedChoice}")`;

          let founded = this.AnswerdQuestionsNumber.find(
            (x: any) => x.questionId === questionId
          );
          if (!founded) {
            this.AnswerdQuestionsNumber.push({ questionId: questionId });
          }
        }
        if (res.returnValue == 505) {
          document.querySelector("#alert-" + questionId).innerHTML =
            "من فضلك تأكد من إختيار إجابه";
          this.toastr.error("من فضلك تأكد من إختيار إجابه", "خطأ");
        }
      });
    }
  }
*/

  PickedChoiceId: IPickedChoiceIdVM[] = [];
  onRadioChange(event: MatRadioChange, questionID: number) {
    // this.PickedChoices = event.value;

    let answer: IPickedChoiceIdVM = {
      questionId: questionID,
      choiceId: event.value,
    };

    let question = this.PickedChoiceId.findIndex(
      (e) => e.questionId === questionID
    );
    if (question >= 0) this.PickedChoiceId[question] = answer;
    else this.PickedChoiceId.push(answer);

    //  console.log("PickedChoiceId", this.PickedChoiceId);
  }

  SingleQuestionForm(questionId: number, groupId: number) {
    let answer = this.PickedChoiceId.find((e) => e.questionId === questionId);
    // console.log("answerFromSigleQ", answer);
    if (answer?.choiceId == null || answer?.choiceId == undefined) {
      this.toastr.warning("من فضلك اختر إجابة");
      return;
    } else {
      let data = {
        examId: this.examId,
        studentUserId: this.studentUserId,
        PickedChoiceId: answer.choiceId,
        questionId: questionId,
        // AnswerText: AnswerText,
      };

      this.studentServ.SubmitSingleQuestion(data).subscribe((res: any) => {
        // console.log("SubmitSingleQuestion", res);

        if (res.returnValue == 200) {
          //this.PickedChoiceId = null;
          document.getElementById(`alert-${questionId}`).style.display = "none";
          let element = document.querySelector("#btn-" + questionId);
          element.classList.remove("btn-primary");
          element.classList.add("btn-success");
          element.innerHTML = "تم حفظ الإجابة";
          let ansMsg = document.getElementById(`stu-cho-${questionId}`);
          ansMsg.style.display = "block";
          ansMsg.innerHTML = `تم اختيار الإجابة : ("${res.returnedChoice}")`;

          // add groupId to AnswerdGroups to change solved group question color
          this.AnswerdGroups.push(groupId);

          // jumb to next question
          let currentGroupIndex = this.ExamGroups.findIndex(
            (e) => e.GroupId === this.currentGroupId
          );
          let nextGroupId = this.ExamGroups[currentGroupIndex + 1]?.GroupId;
          if (nextGroupId) this.currentGroupId = nextGroupId;

          // add answerd question to answers list
          let founded = this.AnswerdQuestionsNumber.find(
            (x: any) => x.questionId === questionId
          );
          if (!founded) {
            this.AnswerdQuestionsNumber.push({ questionId: questionId });
          }
        }

        if (res.returnValue == 505) {
          document.querySelector("#alert-" + questionId).innerHTML =
            "من فضلك تأكد من إختيار إجابه";
          this.toastr.error("من فضلك تأكد من إختيار إجابه", "خطأ");
        }
      });
    }
  }

  SubmitExam() {
    //let confirmed = confirm('هل انت متأكد من حفظ الإمتحان والخروج؟');
    if (
      this.questionNumber - this.solvedQuestionNumberArr.length >
      this.AnswerdQuestionsNumber.length
    ) {
      let msg =
        ' لم يتم إجابة جميع الاسئله، عدد الاسئله التي لم يتم إجابتها "' +
        (this.questionNumber -
          this.solvedQuestionNumberArr.length -
          this.AnswerdQuestionsNumber.length) +
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
