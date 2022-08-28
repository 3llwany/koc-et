export interface IAddEditQuestionTextModel {
  //question data
  exam_selected_question_head_id: number;
  exam_question_type_id: number;
  exam_selected_subject_id: number;
  exam_question_text: string;
  exam_question_mark: number;
  exam_question_perfect_answer: string;
  exam_question_main_question: string;
  exam_question_id: number;
  //file image
  exam_question_image: examQuestionImage;
}

export interface examQuestionImage {
  name: string;
  size: string;
  type: string;
  FileAsBase64: string;
}

export interface IAddedTextExamResponse {
  exam_question_id: number;
  returnValue: number;
}

export interface IAddEditQuestionMcqModel {
  //question data
  exam_selected_question_head_id: number;
  exam_question_type_id: number;
  exam_selected_subject_id: number;
  exam_question_text: string;
  exam_question_mark: number;
  exam_question_perfect_answer: string;
  exam_question_main_question: string;
  exam_question_id: number;
  //file image
  exam_question_image: examQuestionImage;
  //mcq choices if exam_question_type_id = 2
  mcq_choices: IMcqChoices[];
}

export interface IMcqChoices {
  choice_id: number;
  choice_text: string;
  is_correct: boolean;
  choice_image: examQuestionImage;
}

export interface IQuestionForGridModel {
  Id: number;
  Image: string;
  QuestionTypeAr: string;
  Text: string;
}

export interface IQuestionDetailsForEditModel {
  MCQ_Choices: IMcqDetailsModel[];
  attach_path: string;
  main_question: string;
  mark: number;
  perfect_answer: string;
  question_text: string;
  question_type_id: number;
}

export interface IMcqDetailsModel {
  Id: number;
  Image: string;
  Is_Correct: boolean;
  Text: string;
}
