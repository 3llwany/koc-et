import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { EducationalService } from "app/admin/services/Admin/educational.service";
import { ExamsService } from "app/admin/services/Admin/exams.service";
import {
  GeneralDropdownVM,
  IRowFunctionVM,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { ToastrService } from "ngx-toastr";
import { IDifficultyLevelVM, IMcqChoiceVM } from "app/admin/models/admin/exams";

@Component({
  selector: "app-add-question",
  templateUrl: "./add-question.component.html",
  styleUrls: ["./add-question.component.scss"],
})
export class AddQuestionComponent implements OnInit {
  EduCompId: any;
  branchId: any;
  questionID: any = null;
  myForm!: FormGroup;
  submitted = false;

  Teachers: teacherByEduCompId[];
  subjects: GeneralDropdownVM[];
  units: GeneralDropdownVM[];
  lessons: GeneralDropdownVM[];
  topics: GeneralDropdownVM[];
  DifficultyLevel: IDifficultyLevelVM[];

  functionId: number;
  rowFunctions: IRowFunctionVM[];

  //Images
  QuestionAttachPath: any = null;

  questionsInputs: IMcqChoiceVM[] = [
    {
      choice_id: 0,
      choice_text: "",
      thumbnailPic: "",
      ChoiceAttachPath: "",
      //  IsCorrect: false,
      remove_image: false,
    },
    {
      choice_id: 1,
      choice_text: "",
      thumbnailPic: "",
      ChoiceAttachPath: "",
      // IsCorrect: false,
      remove_image: false,
    },
    {
      choice_id: 2,
      choice_text: "",
      thumbnailPic: "",
      ChoiceAttachPath: "",
      // IsCorrect: false,
      remove_image: false,
    },
    {
      choice_id: 3,
      choice_text: "",
      thumbnailPic: "",
      ChoiceAttachPath: "",
      // IsCorrect: false,
      remove_image: false,
    },
  ];

  get choices() {
    return this.myForm.get("choices") as FormArray;
  }

  get QuestionId() {
    return this.myForm.get("questionBank.question.id");
  }

  get question_type_id() {
    return this.myForm.get("questionBank.question.question_type_id");
  }

  get teacherUserId() {
    return this.myForm.get("questionBank.question.teacherUserId");
  }

  get picked_choice_index() {
    return this.myForm.get("picked_choice_index");
  }

  get QuestionBankId() {
    return this.myForm.get("questionBank.Id");
  }

  get main_subject_id() {
    return this.myForm.get("questionBank.main_subject_id");
  }

  get question_id() {
    return this.myForm.get("questionBank.question_id");
  }

  get unitId() {
    return this.myForm.get("questionBank.unitId");
  }

  get lessonId() {
    return this.myForm.get("questionBank.lessonId");
  }

  get topicId() {
    return this.myForm.get("questionBank.topicId");
  }

  get difficulty_level() {
    return this.myForm.get("questionBank.difficulty_level");
  }

  get question_ar_text() {
    return this.myForm.get("questionBank.question.question_ar_text");
  }

  get perfect_answer() {
    return this.myForm.get("questionBank.question.perfect_answer");
  }

  get mark() {
    return this.myForm.get("questionBank.mark");
  }

  get remove_image() {
    return this.myForm.get("questionBank.question.remove_image");
  }

  get thumbnailPic() {
    return this.myForm.get("questionBank.question.thumbnailPic");
  }

  get FormCtrl() {
    return this.myForm.controls;
  }

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private examsService: ExamsService,
    private GeneralService: GeneralService,
    private EducationalService: EducationalService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.questionID = params.get("questionId");
      this.functionId = Number(params.get("functionId"));
      if (this.functionId) {
        this.authService
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
              //  console.log(`RowFunctions for"${this.functionId}": `, res);
            }
          });
      }

      if (this.questionID) {
        this.getQuestionByID(this.questionID);
      }
    });
  }

  ngOnInit(): void {
    //get Current EduCompId
    this.EduCompId = this.authService.getEduCompId();
    this.branchId = this.authService.getBranchId();
    this.getTeachersByEducompId(this.EduCompId);
    this.getDifficultyLevel();

    this.myForm = this.fb.group({
      questionBank: this.fb.group({
        Id: [0],
        main_subject_id: ["", Validators.required],
        unitId: [""],
        lessonId: [""],
        topicId: [""],
        mark: [, [Validators.required, CustomeValidator.minusNum]],
        difficulty_level: ["1", [Validators.required]],
        question_id: [0],

        question: this.fb.group({
          id: [0, [Validators.required]],
          question_type_id: ["", Validators.required],
          teacherUserId: [""],
          question_ar_text: [""],
          perfect_answer: [],
          remove_image: [false],
          thumbnailPic: [null],
        }),
      }),
      picked_choice_index: [null],
      choices: this.fb.array([]),
    });

    this.changeQuestionType();
    this.setDefaultChoises();
  }

  ngAfterViewInit() {
    this.authService.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getTeachersByEducompId(e.EduCompId);
    });

    this.authService.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });

    //console.log("choices ", this.choices.value);
    //  console.log("choices controls ", this.choices.controls);
  }

  private setDefaultChoises() {
    this.questionsInputs.map((d) =>
      this.choices.push(
        this.fb.group({
          choice_id: d.choice_id,
          choice_text: d.choice_text,
          thumbnailPic: d.thumbnailPic,
          remove_image: d.remove_image,
          //IsCorrect: d.IsCorrect,
        })
      )
    );
  }

  getQuestionByID(id: any) {
    this.spinner.show();
    this.examsService.getQuestionByID(id).subscribe((res: any) => {
      //console.log("getQuestionByID: ", res);
      if (res.QuestionId != null) {
        this.teacherUserId?.enable();
        this.main_subject_id?.enable();
        this.getSubjectByTeacherId(res.TeacherUserId);
        this.GetUnits(res.SubjectId);
        this.GetLessons(res.UnitId);
        this.GetTopics(res.LessonId);

        this.QuestionBankId?.setValue(res.QuestionBankId);
        this.QuestionId?.setValue(res.QuestionId);
        this.question_id?.setValue(res.QuestionId);
        this.main_subject_id?.setValue(String(res.SubjectId));
        this.question_type_id?.setValue(res.QuestionTypeId);
        this.teacherUserId?.setValue(res.TeacherUserId);
        this.unitId?.setValue(String(res.UnitId));
        this.lessonId?.setValue(String(res.LessonId));
        this.topicId?.setValue(String(res.TopicId));
        this.difficulty_level?.setValue(res.DifficultyLevel);
        this.question_ar_text?.setValue(res.QuestionTextAr);
        this.perfect_answer?.setValue(res.PerfectAnswer);
        this.mark?.setValue(res.Mark);
        this.thumbnailPic?.setValue(res.QuestionAttachId);

        this.QuestionAttachPath =
          res.QuestionAttachPath != null
            ? "mozakretyapi" + res.QuestionAttachPath
            : null;

        if (res.Choices.length != 0) {
          let d = res.Choices;
          this.choices.clear();
          this.questionsInputs = res.Choices;
          this.questionsInputs.map((d: any) =>
            this.choices.push(
              this.fb.group({
                choice_id: d.ChoiceId,
                choice_text: d.ChoiceText,
                thumbnailPic: d.thumbnailPic,
                ChoiceAttachPath:
                  d.ChoiceAttachPath != null
                    ? "mozakretyapi" + d.ChoiceAttachPath
                    : null,
                //  IsCorrect: d.IsCorrect,
                remove_image: d.remove_image || false,
              })
            )
          );
          // console.log("this.questionsInputs", this.questionsInputs);
          // console.log("this.Choices", this.choices.value);

          for (let obj of res.Choices) {
            if (obj.IsCorrect == true) {
              let i = res.Choices.findIndex(
                (item: any) => item.IsCorrect === true
              );
              this.picked_choice_index?.setValue(i);
            }
          }
        } else {
          this.setDefaultChoises();
        }
      }

      this.spinner.hide();
    });
  }

  addUpdateQuestion() {
    this.submitted = true;
    // console.log("valid?: ", this.myForm.valid);

    //If MCQ Validation
    if (
      this.question_type_id?.value == 2 ||
      this.question_type_id?.value == 3
    ) {
      //answer 1
      if (
        !this.choices.value[0].thumbnailPic &&
        !this.choices.value[0].choice_text
      ) {
        this.toastr.warning("Must Enter answer 1 text or picture");
        return;
      }

      //answer 2
      if (
        !this.choices.value[1].thumbnailPic &&
        !this.choices.value[1].choice_text
      ) {
        this.toastr.warning("Must Enter answer 2 text or picture");
        return;
      }

      //answer 3
      if (
        !this.choices.value[2].thumbnailPic &&
        !this.choices.value[2].choice_text
      ) {
        this.toastr.warning("Must Enter answer 3 text or picture");
        return;
      }

      //answer 4
      if (
        !this.choices.value[3].thumbnailPic &&
        !this.choices.value[3].choice_text
      ) {
        this.toastr.warning("Must Enter answer 4 text or picture");
        return;
      }

      //Correct answer
      if (this.FormCtrl.picked_choice_index.value < 0) {
        this.toastr.warning("Must Choose Correct answer ");
        return;
      }
    }

    // console.log("myFormValue ", this.myForm.value);
    if (this.myForm.valid) {
      //  console.log("Call API");
      this.spinner.show();
      this.examsService
        .addEditQuestion(this.EduCompId, this.myForm.value)
        .subscribe((res: any) => {
          //   console.log("addQuestion", res);
          if (res.questionId != null) {
            this.question_id.setValue(res.questionId);
            this.questionID = res.questionId;
            // this.router.navigate([], {
            //   queryParams: {
            //     questionId: res.questionId,
            //   },
            //   queryParamsHandling: "merge",
            // });
            this.toastr.success("Question Added Successful");
          }
          this.spinner.hide();
        });
    }
  }

  getDifficultyLevel() {
    this.examsService.getDifficultyLevel().subscribe((res: any) => {
      this.DifficultyLevel = res;
    });
  }

  getTeachersByEducompId(EduCompId: any) {
    // this.main_subject_id?.setValue("");
    // this.unitId?.setValue("");
    // this.lessonId?.setValue("");
    // this.topicId?.setValue("");
    if (EduCompId != null) {
      this.GeneralService.getTeachersByEducompId(EduCompId).subscribe(
        (res: any) => {
          this.Teachers = res.lstTeachers;
          this.teacherUserId?.enable();
        }
      );
    } else {
      this.teacherUserId?.setValue("");
      this.teacherUserId?.disable();
      this.main_subject_id?.disable();
      this.unitId?.disable();
      this.lessonId?.disable();
      this.topicId?.disable();
    }
  }

  getSubjectByTeacherId(teacherId: any) {
    if (teacherId != null) {
      this.GeneralService.getSubjectByTeacherId(teacherId).subscribe(
        (res: any) => {
          this.subjects = res.lsts;
        }
      );
    }
  }

  GetUnits(SubjectId: any) {
    // this.unitId?.setValue("");
    // this.lessonId?.setValue("");
    // this.topicId?.setValue("");
    if (SubjectId != "") {
      this.EducationalService.GetUnits(SubjectId).subscribe((res: any) => {
        this.units = res;
        this.unitId?.enable();
      });
    } else {
      this.unitId?.setValue("");
      this.unitId?.disable();
      this.lessonId?.disable();
      this.topicId?.disable();
    }
  }

  GetLessons(unitId: any) {
    // this.lessonId?.setValue("");
    // this.topicId?.setValue("");
    if (unitId != "") {
      this.EducationalService.GetLessons(unitId).subscribe((res: any) => {
        this.lessons = res;
        this.lessonId?.enable();
      });
    } else {
      this.lessonId?.setValue("");
      this.lessonId?.disable();
      this.topicId?.disable();
    }
  }

  GetTopics(LessonId: any) {
    //  this.topicId?.setValue("");
    if (LessonId != "") {
      this.EducationalService.GetTopics(LessonId).subscribe((res: any) => {
        this.topics = res;
        this.topicId?.enable();
      });
    } else {
      this.topicId?.setValue("");
      this.topicId?.disable();
    }
  }

  setMainSubjectToForm(SubjectId: any) {
    this.main_subject_id?.setValue(SubjectId);
  }

  //OnChange Question Type
  changeQuestionType() {
    this.question_type_id?.valueChanges.subscribe((data) => {
      this.changeValidators();
    });
  }

  //OnChange Question Type Change Validators
  changeValidators() {
    let question_type = this.question_type_id?.value;

    if (question_type == 1) {
      // this.myForm.controls['slectans'].clearValidators();
      this.perfect_answer.setValidators([
        Validators.required,
        CustomeValidator.whiteSpace,
      ]);
    }

    if (question_type == 2 || question_type == 3) {
      this.perfect_answer.clearValidators();
      this.perfect_answer.reset();
      //  this.myForm.controls['slectans'].setValidators([]);
    }

    this.perfect_answer.updateValueAndValidity();
    // this.myForm.controls['slectans'].updateValueAndValidity();
  }

  resetManual() {
    this.myForm.reset();
    this.submitted = false;
    //this.myForm.controls['Year_to_join'].setValue('');
  }

  // Choose Question and answer Imgs
  onChange(event: any, i: any) {
    let fileName = <File>event.target.files[0].name;
    let fileSize = <File>event.target.files[0].size;
    let fileType = <File>event.target.files[0].type;
    let LastModified = <File>event.target.files[0].lastModified;
    let LastModifiedDate = <File>event.target.files[0].lastModifiedDate;

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        let fileReder = event.target.result;
        let data = {
          FileAsBase64: fileReder,
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        // if main question img
        if (i == -1) {
          this.thumbnailPic?.setValue(data);
          this.QuestionAttachPath = fileReder;
        } else {
          for (const obj of this.choices.value) {
            let objIndex = this.choices.value.indexOf(obj);
            if (objIndex === i) {
              obj.thumbnailPic = data;
              obj.ChoiceAttachPath = fileReder;
              break;
            }
          }
        }

        //  console.log("questionsInputs: ", this.questionsInputs);
        // console.log("choices.value: ", this.choices.value);
      };
    }
  }
}
