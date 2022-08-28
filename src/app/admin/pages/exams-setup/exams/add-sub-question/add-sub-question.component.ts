import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { ToastrService } from "ngx-toastr";
import { Component, Inject, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import {
  IQuestionForGridModel,
  examQuestionImage,
  IAddEditQuestionTextModel,
  IMcqChoices,
  IAddEditQuestionMcqModel,
  IAddedTextExamResponse,
  IQuestionDetailsForEditModel,
} from "app/admin/models/admin/AddEditQuestionModel";
import { IUnitModel, ILessionModel } from "app/admin/models/admin/exam";
import { ExamsService } from "app/admin/services/Admin/exams.service";

@Component({
  selector: "app-add-sub-question",
  templateUrl: "./add-sub-question.component.html",
  styleUrls: ["./add-sub-question.component.scss"],
})
export class AddSubQuestionComponent implements OnInit {
  @Input("examId") examId: any;
  @Input("examGroupHeaderId") examGroupHeaderId: any = 0;
  @Input("subjectId") subjectId: any = 0;
  unitId: number = 0;
  lessonId: number = 0;

  units: IUnitModel[] = [];
  lessions: ILessionModel[] = [];

  questionsInGrid: IQuestionForGridModel[] = [];

  questionId: number = 0;

  myForm!: FormGroup;
  submitted = false;
  educationCompanyId: any;
  oneIsCorrect: boolean = false;
  twoIsCorrect: boolean = false;
  threeIsCorrect: boolean = false;
  fourIsCorrect: boolean = false;
  questionFile: any = {
    name: "",
    size: 0,
    type: "",
  };

  answerOneFile: any = {
    name: "",
    size: 0,
    type: "",
  };
  answerTwoFile: any = {
    name: "",
    size: 0,
    type: "",
  };
  answerThreeFile: any = {
    name: "",
    size: 0,
    type: "",
  };
  answerFourFile: any = {
    name: "",
    size: 0,
    type: "",
  };

  get mainQuestionCtrl() {
    return this.myForm.get("mainQuestion");
  }

  get questionTypeIdCtrl() {
    return this.myForm.get("questionTypeId");
  }

  get questionImageCtrl() {
    return this.myForm.get("questionImage");
  }

  get unitIdCtrl() {
    return this.myForm.get("unitId");
  }

  get lessonIdCtrl() {
    return this.myForm.get("lessonId");
  }

  get questionTextCtrl() {
    return this.myForm.get("questionText");
  }

  get questionPerfectAnswerCtrl() {
    return this.myForm.get("questionPerfectAnswer");
  }

  get questionMarkCtrl() {
    return this.myForm.get("questionMark");
  }

  get answerOneIdCtrl() {
    return this.myForm.get("answerOneId");
  }

  get answerOneCtrl() {
    return this.myForm.get("answerOne");
  }

  get answerOneIsCorrectCtrl() {
    return this.myForm.get("answerOneIsCorrect");
  }

  get answerOneImageCtrl() {
    return this.myForm.get("answerOneImage");
  }

  get answerTwoIdCtrl() {
    return this.myForm.get("answerTwoId");
  }

  get answerTwoCtrl() {
    return this.myForm.get("answerTwo");
  }

  get answerTwoIsCorrectCtrl() {
    return this.myForm.get("answerTwoIsCorrect");
  }

  get answerTwoImageCtrl() {
    return this.myForm.get("answerTwoImage");
  }

  get answerThreeIdCtrl() {
    return this.myForm.get("answerThreeId");
  }

  get answerThreeCtrl() {
    return this.myForm.get("answerThree");
  }

  get answerThreeIsCorrectCtrl() {
    return this.myForm.get("answerThreeIsCorrect");
  }

  get answerThreeImageCtrl() {
    return this.myForm.get("answerThreeImage");
  }

  get answerFourIdCtrl() {
    return this.myForm.get("answerFourId");
  }

  get answerFourCtrl() {
    return this.myForm.get("answerFour");
  }

  get answerFourIsCorrectCtrl() {
    return this.myForm.get("answerFourIsCorrect");
  }

  get answerFourImageCtrl() {
    return this.myForm.get("answerFourImage");
  }

  constructor(
    private fb: FormBuilder,
    private examService: ExamsService,
    public authserv: AuthService,
    public toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      mainQuestion: ["", Validators.required],
      questionTypeId: ["", Validators.required],
      questionImage: [""],
      unitId: [""],
      lessionId: [""],
      questionText: [""],
      questionPerfectAnswer: [""],
      questionMark: ["", [Validators.required, CustomeValidator.minusNum]],
      answerOneId: [""],
      answerOne: [""],
      answerOneIsCorrect: [],
      answerOneImage: [""],
      answerTwoId: [""],
      answerTwo: [""],
      answerTwoIsCorrect: [],
      answerTwoImage: [""],
      answerThreeId: [""],
      answerThree: [""],
      answerThreeIsCorrect: [],
      answerThreeImage: [""],
      answerFourId: [""],
      answerFour: [""],
      answerFourIsCorrect: [],
      answerFourImage: [""],
    });

    this.educationCompanyId = this.authserv.getEduCompId();
    this.questionTypeValidation();

    // $('#stack1').on('hidden.bs.modal', () => {
    //   console.log('Model Closed!');
    //   this.myForm.reset();
    //   this.questionsInGrid = [];
    // });
  }

  ngOnChanges() {
    if (this.examGroupHeaderId != 0) this.getAllQuestionsByHeadId();
    if (this.subjectId != 0) this.getAllUnitsBySublectId();
  }

  //get all question for this header
  getAllQuestionsByHeadId() {
    this.examService
      .getAllQuestionsByHeadId<IQuestionForGridModel[]>(this.examGroupHeaderId)
      .subscribe((response) => {
        if (response) {
          //   console.log('getAllQuestionsByHeadId', response);
          this.questionsInGrid = [];
          this.questionsInGrid = response;
        }
      });
  }

  questionTypeValidation() {
    if (this.questionTypeIdCtrl?.value == 1) {
      this.questionPerfectAnswerCtrl?.setValidators(Validators.required);
    } else {
      this.questionPerfectAnswerCtrl?.reset();
      this.questionPerfectAnswerCtrl?.clearAsyncValidators();
    }
    this.questionPerfectAnswerCtrl?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.questionTypeIdCtrl?.value == 1) {
      // مقالي

      let image: examQuestionImage = {
        FileAsBase64: "",
        name: this.questionFile.name,
        size: this.questionFile.size,
        type: this.questionFile.type,
      };

      let toAddEdit: IAddEditQuestionTextModel = {
        exam_question_main_question: this.mainQuestionCtrl?.value,
        exam_question_mark: this.questionMarkCtrl?.value,
        exam_question_perfect_answer: this.questionPerfectAnswerCtrl?.value,
        exam_question_text: this.questionTextCtrl?.value,
        exam_question_type_id: this.questionTypeIdCtrl?.value,
        exam_selected_question_head_id: this.examGroupHeaderId,
        exam_selected_subject_id: this.subjectId,
        exam_question_image: image,
        exam_question_id: this.questionId,
      };

      if (
        toAddEdit.exam_question_perfect_answer != "" &&
        (toAddEdit.exam_question_text != "" || image.FileAsBase64 != "")
      ) {
        if (this.questionId > 0) {
          this.editTextQuestion(toAddEdit);
        } else {
          this.addTextQuestion(toAddEdit);
        }
      } else this.toastr.error("Please Check Your Inputs");
    }

    if (this.questionTypeIdCtrl?.value == 2) {
      // اختيارات

      let image: examQuestionImage = {
        FileAsBase64: "",
        name: this.questionFile.name,
        size: this.questionFile.size,
        type: this.questionFile.type,
      };

      let imageOne: examQuestionImage = {
        FileAsBase64: "",
        name: this.answerOneFile.name,
        size: this.answerOneFile.size,
        type: this.answerOneFile.type,
      };

      let choice1: IMcqChoices = {
        choice_id: this.answerOneIdCtrl?.value ?? 0,
        choice_text: this.answerOneCtrl?.value,
        is_correct: this.answerOneIsCorrectCtrl?.value ? true : false,
        choice_image: imageOne,
      };

      let imageTwo: examQuestionImage = {
        FileAsBase64: "",
        name: this.answerTwoFile.name,
        size: this.answerTwoFile.size,
        type: this.answerTwoFile.type,
      };

      let choice2: IMcqChoices = {
        choice_id: this.answerTwoIdCtrl?.value ?? 0,
        choice_text: this.answerTwoCtrl?.value,
        is_correct: this.answerTwoIsCorrectCtrl?.value ? true : false,
        choice_image: imageTwo,
      };

      let imageThree: examQuestionImage = {
        FileAsBase64: "",
        name: this.answerThreeFile.name,
        size: this.answerThreeFile.size,
        type: this.answerThreeFile.type,
      };

      let choice3: IMcqChoices = {
        choice_id: this.answerThreeIdCtrl?.value ?? 0,
        choice_text: this.answerThreeCtrl?.value,
        is_correct: this.answerThreeIsCorrectCtrl?.value ? true : false,
        choice_image: imageThree,
      };

      let imageFour: examQuestionImage = {
        FileAsBase64: "",
        name: this.answerFourFile.name,
        size: this.answerFourFile.size,
        type: this.answerFourFile.type,
      };

      let choice4: IMcqChoices = {
        choice_id: this.answerFourIdCtrl?.value ?? 0,
        choice_text: this.answerFourCtrl?.value,
        is_correct: this.answerFourIsCorrectCtrl?.value ? true : false,
        choice_image: imageFour,
      };

      let toAddEdit: IAddEditQuestionMcqModel = {
        exam_question_main_question: this.mainQuestionCtrl?.value,
        exam_question_mark: this.questionMarkCtrl?.value,
        exam_question_perfect_answer: this.questionPerfectAnswerCtrl?.value,
        exam_question_text: this.questionTextCtrl?.value,
        exam_question_type_id: this.questionTypeIdCtrl?.value,
        exam_selected_question_head_id: this.examGroupHeaderId,
        exam_selected_subject_id: this.subjectId,
        exam_question_image: image,
        exam_question_id: this.questionId,
        mcq_choices: [choice1, choice2, choice3, choice4],
      };

      // console.log('mcq_choices', toAddEdit.mcq_choices);

      if (
        (choice1.choice_text != null ||
          choice1.choice_image.FileAsBase64 != "") &&
        (choice2.choice_text != null ||
          choice2.choice_image.FileAsBase64 != "") &&
        (choice3.choice_text != null ||
          choice3.choice_image.FileAsBase64 != "") &&
        (choice4.choice_text != null || choice4.choice_image.FileAsBase64 != "")
      ) {
        if (this.questionId > 0) {
          this.editMcqQuestion(toAddEdit);
        } else {
          this.addMcqQuestion(toAddEdit);
        }
      } else this.toastr.error("Please Check Your Inputs");
    }
  }

  addTextQuestion(toAddEdit: IAddEditQuestionTextModel) {
    //  console.log('on add ', toAddEdit);
    this.spinner.show();
    this.examService
      .addQuestion<IAddedTextExamResponse>(toAddEdit)
      .subscribe((response) => {
        // console.log('respooooooonse', response);

        if (response.returnValue == 200) {
          this.getAllQuestionsByHeadId();

          this.mainQuestionCtrl?.setValue(null);
          this.questionMarkCtrl?.setValue(null);
          this.questionTypeIdCtrl?.setValue(null);
          this.questionImageCtrl?.setValue(null);
          this.questionTextCtrl?.setValue(null);
          this.questionPerfectAnswerCtrl?.setValue(null);
          this.unitIdCtrl?.setValue(null);
          this.lessonIdCtrl?.setValue(null);

          this.myForm.reset();
        }
        this.spinner.hide();
      });
  }

  editTextQuestion(toAddEdit: IAddEditQuestionTextModel) {
    //  console.log('tooEdiiiiiiit', toAddEdit);
    this.spinner.show();
    this.examService
      .editQuestion<IQuestionDetailsForEditModel>(toAddEdit)
      .subscribe((response) => {
        //  console.log('ediiiiiitResponse', response);
        if (response) {
          let toEdit = this.questionsInGrid.find(
            (q) => q.Id == this.questionId
          );

          if (toEdit) {
            toEdit.Text = this.questionTextCtrl?.value;
            toEdit.QuestionTypeAr = "مقال";
            toEdit.Image = this.questionImageCtrl?.value;
          }

          this.mainQuestionCtrl?.setValue(null);
          this.questionMarkCtrl?.setValue(null);
          this.questionTypeIdCtrl?.setValue(null);
          this.questionImageCtrl?.setValue(null);
          this.questionTextCtrl?.setValue(null);
          this.questionPerfectAnswerCtrl?.setValue(null);

          this.unitIdCtrl?.setValue(null);
          this.lessonIdCtrl?.setValue(null);

          this.myForm.reset();

          this.questionId = 0; // return to add mode
        }
        this.spinner.hide();
      });
  }

  addMcqQuestion(toAddEdit: IAddEditQuestionMcqModel) {
    // console.log('on add ', toAddEdit);
    this.spinner.show();
    this.examService
      .addQuestion<IAddedTextExamResponse>(toAddEdit)
      .subscribe((response) => {
        // console.log('respooooooonse', response);

        if (response.returnValue == 200) {
          this.getAllQuestionsByHeadId();

          this.mainQuestionCtrl?.setValue(null);
          this.questionMarkCtrl?.setValue(null);
          this.questionTypeIdCtrl?.setValue(null);
          this.questionImageCtrl?.setValue(null);
          this.questionTextCtrl?.setValue(null);
          this.questionPerfectAnswerCtrl?.setValue(null);
          this.unitIdCtrl?.setValue(null);
          this.lessonIdCtrl?.setValue(null);

          this.myForm.reset();
        }
        this.spinner.hide();
      });
  }

  editMcqQuestion(toAddEdit: IAddEditQuestionMcqModel) {
    // console.log('tooEdiiiiiiit', toAddEdit);
    this.spinner.show();
    this.examService
      .editQuestion<IQuestionDetailsForEditModel>(toAddEdit)
      .subscribe((response) => {
        //  console.log('ediiiiiitResponse', response);
        if (response) {
          let toEdit = this.questionsInGrid.find(
            (q) => q.Id == this.questionId
          );

          if (toEdit) {
            toEdit.Text = this.questionTextCtrl?.value;
            toEdit.QuestionTypeAr = "اختيار من متعدد";
            toEdit.Image = this.questionImageCtrl?.value;
          }

          this.mainQuestionCtrl?.setValue(null);
          this.questionMarkCtrl?.setValue(null);
          this.questionTypeIdCtrl?.setValue(null);
          this.questionImageCtrl?.setValue(null);
          this.questionTextCtrl?.setValue(null);
          this.questionPerfectAnswerCtrl?.setValue(null);

          this.unitIdCtrl?.setValue(null);
          this.lessonIdCtrl?.setValue(null);

          this.myForm.reset();

          this.questionId = 0; // return to add mode
        }
        this.spinner.hide();
      });
  }

  editExamQuestionForm(questionId: number) {
    //  console.log('questionIddddddddddddddd', questionId);
    this.spinner.show();
    this.examService
      .getQuestionForEditByID<IQuestionDetailsForEditModel>(questionId)
      .subscribe((response) => {
        //   console.log('resssssponse', response);
        if (response) {
          this.mainQuestionCtrl?.setValue(response.main_question);
          this.questionMarkCtrl?.setValue(response.mark);
          this.questionTextCtrl?.setValue(response.question_text);
          //this.questionImageCtrl?.setValue(response.attach_path);
          this.questionTypeIdCtrl?.setValue(response.question_type_id);
          this.questionId = questionId;

          if (response.question_type_id == 1) {
            this.questionPerfectAnswerCtrl?.setValue(response.perfect_answer);
          }

          if (response.question_type_id == 2) {
            this.answerOneIdCtrl?.setValue(response.MCQ_Choices[0].Id);
            this.answerOneCtrl?.setValue(response.MCQ_Choices[0].Text);
            //this.answerOneImageCtrl?.setValue(response.MCQ_Choices[0].Image);
            this.answerOneIsCorrectCtrl?.setValue(
              response.MCQ_Choices[0].Is_Correct
            );
            this.oneIsCorrect = response.MCQ_Choices[0].Is_Correct;

            this.answerTwoIdCtrl?.setValue(response.MCQ_Choices[1].Id);
            this.answerTwoCtrl?.setValue(response.MCQ_Choices[1].Text);
            //this.answerTwoImageCtrl?.setValue(response.MCQ_Choices[1].Image);
            this.answerTwoIsCorrectCtrl?.setValue(
              response.MCQ_Choices[1].Is_Correct
            );
            this.twoIsCorrect = response.MCQ_Choices[1].Is_Correct;

            this.answerThreeIdCtrl?.setValue(response.MCQ_Choices[2].Id);
            this.answerThreeCtrl?.setValue(response.MCQ_Choices[2].Text);
            //this.answerThreeImageCtrl?.setValue(response.MCQ_Choices[2].Image);
            this.answerThreeIsCorrectCtrl?.setValue(
              response.MCQ_Choices[2].Is_Correct
            );
            this.threeIsCorrect = response.MCQ_Choices[2].Is_Correct;

            this.answerFourIdCtrl?.setValue(response.MCQ_Choices[3].Id);
            this.answerFourCtrl?.setValue(response.MCQ_Choices[3].Text);
            //this.answerFourImageCtrl?.setValue(response.MCQ_Choices[3].Image);
            this.answerFourIsCorrectCtrl?.setValue(
              response.MCQ_Choices[3].Is_Correct
            );
            this.fourIsCorrect = response.MCQ_Choices[3].Is_Correct;
          }

          console.log("answer 1", this.oneIsCorrect);
          console.log("answer 2", this.twoIsCorrect);
          console.log("answer 3", this.threeIsCorrect);
          console.log("answer 4", this.fourIsCorrect);
        }
        this.spinner.hide();
      });
  }

  removeExamQuestion(questionId: number) {
    // console.log('questionId', questionId);
    this.spinner.show();
    this.examService
      .deleteExamQuestion<any>(questionId)
      .subscribe((response) => {
        // console.log('deleteResponse', response);
        if ((response.returnString = "Done")) {
          let toDeleteIndex = this.questionsInGrid.findIndex(
            (q) => q.Id == questionId
          );
          this.questionsInGrid.splice(toDeleteIndex, 1);
        }
        this.spinner.hide();
      });
  }

  importFile(event: any) {
    if (event.target.files.length == 0) {
      console.log("No file selected!");
      return;
    }
    this.questionFile = event.target.files[0];
    console.log("file selected", this.questionFile);
  }

  importOneFile(event: any) {
    if (event.target.files.length == 0) {
      console.log("No file selected!");
      return;
    }
    this.answerOneFile = event.target.files[0];
    console.log("file selected", this.answerOneFile);
  }

  importTwoFile(event: any) {
    if (event.target.files.length == 0) {
      console.log("No file selected!");
      return;
    }
    this.answerTwoFile = event.target.files[0];
    console.log("file selected", this.answerTwoFile);
  }

  importThreeFile(event: any) {
    if (event.target.files.length == 0) {
      console.log("No file selected!");
      return;
    }
    this.answerThreeFile = event.target.files[0];
    console.log("file selected", this.answerThreeFile);
  }

  importFourFile(event: any) {
    if (event.target.files.length == 0) {
      console.log("No file selected!");
      return;
    }
    this.answerFourFile = event.target.files[0];
    console.log("file selected", this.answerFourFile);
  }

  getAllUnitsBySublectId() {
    this.examService
      .getAllUnitsBySublectId<any[]>(this.subjectId)
      .subscribe((results) => {
        this.units = results;
        // console.log('this.units', this.units);
      });
  }

  getAllLessonsByUnitId() {
    this.examService
      .getAllLessonsByUnitId<any>(this.unitIdCtrl?.value)
      .subscribe((response) => {
        if (response) {
          this.lessions = response;
        }
      });
  }

  onSelectCorrect(answerNumber: number) {
    console.log("answer is selecteddddd", answerNumber);
    if (answerNumber == 0) {
      this.answerTwoIsCorrectCtrl?.setValue(null);
      this.answerThreeIsCorrectCtrl?.setValue(null);
      this.answerFourIsCorrectCtrl?.setValue(null);
    }
    if (answerNumber == 1) {
      this.answerOneIsCorrectCtrl?.setValue(null);
      this.answerThreeIsCorrectCtrl?.setValue(null);
      this.answerFourIsCorrectCtrl?.setValue(null);
    }
    if (answerNumber == 2) {
      this.answerTwoIsCorrectCtrl?.setValue(null);
      this.answerOneIsCorrectCtrl?.setValue(null);
      this.answerFourIsCorrectCtrl?.setValue(null);
    }
    if (answerNumber == 3) {
      this.answerTwoIsCorrectCtrl?.setValue(null);
      this.answerThreeIsCorrectCtrl?.setValue(null);
      this.answerOneIsCorrectCtrl?.setValue(null);
    }
  }
}
