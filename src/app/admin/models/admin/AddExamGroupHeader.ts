export interface IAddExamGroupHeaderModel {
  exam_question_head_text: string;
  exam_question_group_text: string;
  exam_question_head_title: string;
  exam: IExamModel;
}

export interface IExamModel {
  id: number;
}

export interface IExamGroupHeaderModel {
  group_name: string;
  head_name: string;
  question_title: string;
  exam_question_group_id: number;
  id: number;
  questionNumber: string;
  questionType: string;
  question_head_id: number;
}

export interface IEditExamGroupHeaderModel {
  exam_question_head_id: number;
  group: string;
  head: string;
  title: string;
}
