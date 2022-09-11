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
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-add-sub-question",
  templateUrl: "./add-sub-question.component.html",
  styleUrls: ["./add-sub-question.component.scss"],
})
export class AddSubQuestionComponent implements OnInit {
  examId: number;
  examGroupHeaderId: number;
  subjectId: number;
  // @Input("examId") examId: any;
  // @Input("examGroupHeaderId") examGroupHeaderId: any = 0;
  // @Input("subjectId") subjectId: any = 0;
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
  questionFile: any = null;
  answerOneFile: any = null;
  answerTwoFile: any = null;
  answerThreeFile: any = null;
  answerFourFile: any = null;

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
    return this.myForm.get("exam_question_text");
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

  get answerOneRemove_imageCtrl() {
    return this.myForm.get("answerOneRemove_image");
  }

  get answerTwoRemove_imageCtrl() {
    return this.myForm.get("answerTwoRemove_image");
  }

  get answerThreeRemove_imageCtrl() {
    return this.myForm.get("answerThreeRemove_image");
  }

  get answerFourRemove_imageCtrl() {
    return this.myForm.get("answerFourRemove_image");
  }

  get questionImageRemove_imageCtrl() {
    return this.myForm.get("remove_image");
  }

  constructor(
    private fb: FormBuilder,
    private examService: ExamsService,
    public authserv: AuthService,
    public toastr: ToastrService,
    private spinner: NgxSpinnerService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.examId = data.examId;
    this.examGroupHeaderId = data.examGroupHeaderId;
    this.subjectId = data.subjectId;
    if (this.examGroupHeaderId != 0) this.getAllQuestionsByHeadId();
    if (this.subjectId != 0) this.getAllUnitsBySublectId();
    console.log("this.examId", this.examId);
    console.log("this.examGroupHeaderId", this.examGroupHeaderId);
    console.log("this.subjectId", this.subjectId);
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      mainQuestion: [""],
      questionTypeId: ["", Validators.required],
      questionImage: [""],
      remove_image: [false],
      unitId: [""],
      lessionId: [""],
      exam_question_text: [""],
      questionPerfectAnswer: [""],
      questionMark: ["", [Validators.required, CustomeValidator.bigZero]],
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
      answerOneRemove_image: [false],
      answerTwoRemove_image: [false],
      answerThreeRemove_image: [false],
      answerFourRemove_image: [false],
    });
    //remove_image: d.remove_image,
    this.educationCompanyId = this.authserv.getEduCompId();
    this.questionTypeValidation();
  }

  //get all question for this header
  getAllQuestionsByHeadId() {
    this.spinner.show();
    this.examService
      .getAllQuestionsByHeadId<IQuestionForGridModel[]>(this.examGroupHeaderId)
      .subscribe((response) => {
        if (response) {
          console.log("getAllQuestionsByHeadId", response);
          this.questionsInGrid = [];
          this.questionsInGrid = response;
          this.spinner.hide();
        }
      });
  }

  questionTypeValidation() {
    if (this.questionTypeIdCtrl?.value === 1) {
      console.log("PerfectAnswer is required");
      this.questionPerfectAnswerCtrl?.setValidators(Validators.required);
    } else {
      console.log("PerfectAnswer is not required");
      this.questionPerfectAnswerCtrl?.clearAsyncValidators();
      this.questionPerfectAnswerCtrl?.reset();
    }
    this.questionPerfectAnswerCtrl?.updateValueAndValidity();
  }

  onSubmit() {
    this.submitted = true;
    if (this.questionTypeIdCtrl?.value == 1) {
      // مقالي

      let image: examQuestionImage = this.questionFile || null;
      // let image: examQuestionImage = this.questionFile || null {
      //   FileAsBase64: this.questionFile.FileAsBase64 || null,
      //   name: this.questionFile.name,
      //   size: this.questionFile.size,
      //   type: this.questionFile.type,
      // };

      let toAddEdit: IAddEditQuestionTextModel = {
        exam_question_main_question: this.mainQuestionCtrl?.value,
        exam_question_mark: this.questionMarkCtrl?.value,
        exam_question_perfect_answer: this.questionPerfectAnswerCtrl?.value,
        exam_question_text: this.questionTextCtrl?.value,
        exam_question_type_id: this.questionTypeIdCtrl?.value,
        exam_selected_question_head_id: this.examGroupHeaderId,
        exam_selected_subject_id: this.subjectId,
        exam_question_image: image,
        remove_image: this.questionImageRemove_imageCtrl?.value,
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

      let image: examQuestionImage = this.questionFile || null;
      let questionImagePath = this.questionImageCtrl;
      // let image: examQuestionImage = {
      //   FileAsBase64: this.questionFile.FileAsBase64 || null,
      //   name: this.questionFile.name,
      //   size: this.questionFile.size,
      //   type: this.questionFile.type,
      // };

      let imageOne: examQuestionImage = this.answerOneFile || null;
      // let imageOne: examQuestionImage = {
      //   FileAsBase64: this.answerOneFile.FileAsBase64 || null,
      //   name: this.answerOneFile.name,
      //   size: this.answerOneFile.size,
      //   type: this.answerOneFile.type,
      // };

      let choice1: IMcqChoices = {
        choice_id: this.answerOneIdCtrl?.value ?? 0,
        choice_text: this.answerOneCtrl?.value,
        is_correct: this.answerOneIsCorrectCtrl.value ? true : false,
        choice_image: imageOne,
        remove_image: this.answerOneRemove_imageCtrl?.value,
        path: this.answerOneImageCtrl?.value,
      };

      let imageTwo: examQuestionImage = this.answerTwoFile || null;
      // let imageTwo: examQuestionImage = {
      //   FileAsBase64: this.answerTwoFile.FileAsBase64 || null,
      //   name: this.answerTwoFile.name,
      //   size: this.answerTwoFile.size,
      //   type: this.answerTwoFile.type,
      // };

      let choice2: IMcqChoices = {
        choice_id: this.answerTwoIdCtrl?.value ?? 0,
        choice_text: this.answerTwoCtrl?.value,
        is_correct: this.answerTwoIsCorrectCtrl?.value ? true : false,
        choice_image: imageTwo,
        remove_image: this.answerTwoRemove_imageCtrl?.value,
        path: this.answerTwoImageCtrl?.value,
      };

      let imageThree: examQuestionImage = this.answerThreeFile || null;
      // let imageThree: examQuestionImage = {
      //   FileAsBase64: this.answerThreeFile.FileAsBase64 || null,
      //   name: this.answerThreeFile.name,
      //   size: this.answerThreeFile.size,
      //   type: this.answerThreeFile.type,
      // };

      let choice3: IMcqChoices = {
        choice_id: this.answerThreeIdCtrl?.value ?? 0,
        choice_text: this.answerThreeCtrl?.value,
        is_correct: this.answerThreeIsCorrectCtrl?.value ? true : false,
        choice_image: imageThree,
        remove_image: this.answerThreeRemove_imageCtrl?.value,
        path: this.answerThreeImageCtrl?.value,
      };

      let imageFour: examQuestionImage = this.answerFourFile || null;
      // let imageFour: examQuestionImage = {
      //   FileAsBase64: this.answerFourFile.FileAsBase64 || null,
      //   name: this.answerFourFile.name,
      //   size: this.answerFourFile.size,
      //   type: this.answerFourFile.type,
      // };

      let choice4: IMcqChoices = {
        choice_id: this.answerFourIdCtrl?.value ?? 0,
        choice_text: this.answerFourCtrl?.value,
        is_correct: this.answerFourIsCorrectCtrl?.value ? true : false,
        choice_image: imageFour,
        remove_image: this.answerFourRemove_imageCtrl?.value,
        path: this.answerFourImageCtrl?.value,
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
        remove_image: this.questionImageRemove_imageCtrl?.value,
        exam_question_id: this.questionId,
        mcq_choices: [choice1, choice2, choice3, choice4],
      };

      console.log("FormValue", toAddEdit);
      // if no question Text or img
      if (
        !this.questionTextCtrl?.value &&
        image == null &&
        questionImagePath == null
      ) {
        this.toastr.warning("يجب ادخال نص السؤال او اختيار صوره السؤال");
        return;
      }

      // if no correct answer
      if (
        !choice1.is_correct &&
        !choice2.is_correct &&
        !choice3.is_correct &&
        !choice4.is_correct
      ) {
        this.toastr.warning("يجب اختيار الإجابة الصحيحة");
        return;
      }

      // if mcq 1 no text or img
      if (
        choice1.choice_text === "" &&
        choice1.choice_image === null &&
        choice1.path == null
      ) {
        this.toastr.warning("يجب ادخال نص السؤال الأول او اختيار صورة ");
        return;
      }

      // if mcq 2 no text or img
      if (
        choice2.choice_text === "" &&
        choice2.choice_image === null &&
        choice2.path == null
      ) {
        this.toastr.warning("يجب ادخال نص السؤال الثاني او اختيار صورة ");
        return;
      }

      // if mcq 3 no text or img
      if (
        choice3.choice_text === "" &&
        choice3.choice_image === null &&
        choice3.path == null
      ) {
        this.toastr.warning("يجب ادخال نص السؤال الثالث او اختيار صورة ");
        return;
      }

      // if mcq 4 no text or img
      if (
        choice4.choice_text === "" &&
        choice4.choice_image === null &&
        choice4.path == null
      ) {
        this.toastr.warning("يجب ادخال نص السؤال الرابع او اختيار صورة ");
        return;
      }

      // if (
      //   (choice1.choice_text === "" ||
      //     choice1.choice_image?.FileAsBase64 === null) &&
      //   (choice2.choice_text === "" ||
      //     choice2.choice_image?.FileAsBase64 === null) &&
      //   (choice3.choice_text === "" ||
      //     choice3.choice_image?.FileAsBase64 === null) &&
      //   (choice4.choice_text === "" ||
      //     choice4.choice_image.FileAsBase64 === null)
      // ) {
      //   this.toastr.warning("يجب ادخال نص جميع الاجابات او اختيار صور ");
      //   return;
      // }
      else {
        if (this.questionId > 0) {
          this.editMcqQuestion(toAddEdit);
        } else {
          this.addMcqQuestion(toAddEdit);
        }
      }
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
    if (this.myForm.valid) {
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
            this.submitted = false;
          }
          this.spinner.hide();
        });
    }
  }

  editMcqQuestion(toAddEdit: IAddEditQuestionMcqModel) {
    console.log("editMcqQuestion", toAddEdit);
    if (this.myForm.valid) {
      this.spinner.show();
      this.examService
        .editQuestion<IQuestionDetailsForEditModel>(toAddEdit)
        .subscribe((response) => {
          console.log("editMcqQuestion", response);
          if (response) {
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
            this.submitted = false;

            this.questionId = 0; // return to add mode
          }
          this.spinner.hide();
        });
    }
  }

  getQuestionForEditByID(questionId: number) {
    //  console.log('questionIddddddddddddddd', questionId);
    this.spinner.show();
    this.examService
      .getQuestionForEditByID<IQuestionDetailsForEditModel>(questionId)
      .subscribe((response) => {
        console.log("getQuestionForEditByID", response);
        if (response) {
          this.mainQuestionCtrl?.setValue(response.main_question);
          this.questionMarkCtrl?.setValue(response.mark);
          this.questionTextCtrl?.setValue(response.question_text);
          this.questionImageCtrl?.setValue(
            response?.attach_path != null
              ? "mozakretyapi" + response?.attach_path
              : null
          );
          // this.questionFile.FileAsBase64 = response.attach_path;
          this.questionTypeIdCtrl?.setValue(response.question_type_id);
          this.questionId = questionId;

          if (response.question_type_id == 1) {
            this.questionPerfectAnswerCtrl?.setValue(response.perfect_answer);
          }

          if (response.question_type_id == 2) {
            this.answerOneIdCtrl?.setValue(response.MCQ_Choices[0]?.Id);
            this.answerOneCtrl?.setValue(response.MCQ_Choices[0]?.Text);
            this.answerOneImageCtrl?.setValue(
              response?.MCQ_Choices[0]?.Image != null
                ? "mozakretyapi" + response?.MCQ_Choices[0]?.Image
                : null
            );
            // this.answerOneImageCtrl?.setValue(response.MCQ_Choices[0].Image);
            //  this.answerOneFile.FileAsBase64 = response.MCQ_Choices[0].Image;
            this.answerOneIsCorrectCtrl?.setValue(
              response.MCQ_Choices[0]?.Is_Correct
            );
            this.oneIsCorrect = response.MCQ_Choices[0]?.Is_Correct;

            this.answerTwoIdCtrl?.setValue(response.MCQ_Choices[1]?.Id);
            this.answerTwoCtrl?.setValue(response.MCQ_Choices[1]?.Text);
            this.answerTwoImageCtrl?.setValue(
              response?.MCQ_Choices[1]?.Image != null
                ? "mozakretyapi" + response?.MCQ_Choices[1]?.Image
                : null
            );
            //  this.answerTwoImageCtrl?.setValue(response.MCQ_Choices[1].Image);
            // this.answerTwoFile.FileAsBase64 = response.MCQ_Choices[1].Image;
            this.answerTwoIsCorrectCtrl?.setValue(
              response.MCQ_Choices[1]?.Is_Correct
            );
            this.twoIsCorrect = response.MCQ_Choices[1]?.Is_Correct;

            this.answerThreeIdCtrl?.setValue(response.MCQ_Choices[2]?.Id);
            this.answerThreeCtrl?.setValue(response.MCQ_Choices[2]?.Text);
            this.answerThreeImageCtrl?.setValue(
              response?.MCQ_Choices[2]?.Image != null
                ? "mozakretyapi" + response?.MCQ_Choices[2]?.Image
                : null
            );
            // this.answerThreeImageCtrl?.setValue(response.MCQ_Choices[2].Image);
            //  this.answerThreeFile.FileAsBase64 = response.MCQ_Choices[2].Image;
            this.answerThreeIsCorrectCtrl?.setValue(
              response.MCQ_Choices[2]?.Is_Correct
            );
            this.threeIsCorrect = response.MCQ_Choices[2]?.Is_Correct;

            this.answerFourIdCtrl?.setValue(response.MCQ_Choices[3]?.Id);
            this.answerFourCtrl?.setValue(response.MCQ_Choices[3]?.Text);
            this.answerFourImageCtrl?.setValue(
              response?.MCQ_Choices[3]?.Image != null
                ? "mozakretyapi" + response?.MCQ_Choices[3]?.Image
                : null
            );
            //  this.answerFourImageCtrl?.setValue(response.MCQ_Choices[3].Image);
            //  this.answerFourFile.FileAsBase64 = response.MCQ_Choices[3].Image;
            this.answerFourIsCorrectCtrl?.setValue(
              response.MCQ_Choices[3]?.Is_Correct
            );
            this.fourIsCorrect = response.MCQ_Choices[3]?.Is_Correct;
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
    let confirmed = confirm("هل انت متأكد من الحذف");
    // console.log('questionId', questionId);
    if (confirmed) {
      this.spinner.show();
      this.examService
        .deleteExamQuestion<any>(questionId)
        .subscribe((response) => {
          // console.log('deleteResponse', response);
          if (response.returnString === "Done") {
            let toDeleteIndex = this.questionsInGrid.findIndex(
              (q) => q.Id == questionId
            );
            this.questionsInGrid.splice(toDeleteIndex, 1);
          } else this.toastr.info(response.returnString);
          this.spinner.hide();
        });
    }
  }

  importFile(event: any) {
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
        this.questionImageCtrl.setValue(fileReder);
        this.questionFile = data;
        //  console.log("file selected", this.questionFile);
      };
    }
  }

  importOneFile(event: any) {
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
        this.answerOneFile = data;
        this.answerOneImageCtrl.setValue(fileReder);
        //  console.log("file selected", this.answerOneFile);
      };
    }
  }

  importTwoFile(event: any) {
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
        this.answerTwoFile = data;
        this.answerTwoImageCtrl.setValue(fileReder);
        //  console.log("file selected", this.answerTwoFile);
      };
    }
  }

  importThreeFile(event: any) {
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
        this.answerThreeFile = data;
        this.answerThreeImageCtrl.setValue(fileReder);
        //  console.log("file selected", this.answerThreeFile);
      };
    }
  }

  importFourFile(event: any) {
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
        this.answerFourFile = data;
        this.answerFourImageCtrl.setValue(fileReder);
        //  console.log("file selected", this.answerFourFile);
      };
    }
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
    console.log("answer is Correct", answerNumber);
    if (answerNumber === 0) {
      this.answerOneIsCorrectCtrl?.setValue(0);
      this.answerTwoIsCorrectCtrl?.setValue(null);
      this.answerThreeIsCorrectCtrl?.setValue(null);
      this.answerFourIsCorrectCtrl?.setValue(null);
    }
    if (answerNumber === 1) {
      this.answerOneIsCorrectCtrl?.setValue(null);
      this.answerTwoIsCorrectCtrl?.setValue(1);
      this.answerThreeIsCorrectCtrl?.setValue(null);
      this.answerFourIsCorrectCtrl?.setValue(null);
    }
    if (answerNumber === 2) {
      this.answerOneIsCorrectCtrl?.setValue(null);
      this.answerTwoIsCorrectCtrl?.setValue(null);
      this.answerThreeIsCorrectCtrl?.setValue(2);
      this.answerFourIsCorrectCtrl?.setValue(null);
    }
    if (answerNumber === 3) {
      this.answerOneIsCorrectCtrl?.setValue(null);
      this.answerTwoIsCorrectCtrl?.setValue(null);
      this.answerThreeIsCorrectCtrl?.setValue(null);
      this.answerFourIsCorrectCtrl?.setValue(3);
    }
  }
}
