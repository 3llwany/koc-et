export interface IExamViewModel {
  Id: number;
  Name: string;
  Subject: string;
  Year: string;
  Teacher: string;
  IsPublish: boolean;
}

export class ExamViewModel {
  id: number;
  exam_ar_name: string;
  EduCompId: number;
}

export interface IExamSearchModel {
  EduCompId: number;
  page: number;
  countryId: number;
  stageId: number;
  yearId: number;
  subjectId: number;
  teacherId: number;
}

export interface ICountrieDropModel {
  country_id: number;
  country_ar_name: string;
  country_en_name: string;
  state: boolean;
}
export interface IStageDropModel {
  id: number;
  stage_ar_name: string;
  stage_en_name: string;
  state: boolean;
  StageCountr: number;
  ImagePath: string;
  CountryID: number;
  EnglishStage: boolean;
}
export interface IEducationYearDropModel {
  id: number;
  Educational_year_ar_name: string;
  Educational_year_en_name: string;
  state: boolean;
  StageID: number;
}
export interface ISubjectDropModel {
  subject_id: number;
  subject_ar_name: string;
  subject_en_name: string;
}
export interface ITeacherDropModel {
  Id: number;
  Name: string;
}

export interface ITeacherReportDropModel {
  teacherUserId: number;
  TeacherName: string;
}

export interface IExamTypeModel {
  exam_type_id: number;
  exam_ar_type_name: string;
}
export interface IUnitModel {
  id: number;
  unit_ar_name: string;
}
export interface ILessionModel {
  id: number;
  lesson_ar_name: string;
}
export interface IDiscountTypeModel {
  Id: number;
  Name: string;
}

export interface IExamGroupModel {
  Id: number;
  Name: string;
}
export interface IExamHeaderModel {
  Id: number;
  Name: string;
}
export interface IPickedChoiceIdVM {
  questionId: number;
  choiceId: number;
}
export interface IExamGroupsVM {
  GroupId: number;
  GroupName: string;
  Heads: IExamHeadsVM[];
}
export interface IExamHeadsVM {
  GroupId: number;
  HeadId: number;
  HeadName: string;
  Questions: IExamQuestionsVM[];
}
export interface IExamQuestionsVM {
  Id: number;
  HeadId: number;
  MCQ: IExamMCQQuestionVM[];
  QuestionDetails: IExamQuestionDetailsVM;
}

export interface IExamMCQQuestionVM {
  Id: number;
  IsCorrect: boolean;
  MCQAttach: any;
  MCQText: string;
  questionId: number;
}
export interface IExamQuestionDetailsVM {
  StudentChoice: any;
  questionAttach: any;
  questionId: number;
  questionMark: number;
  questionText: string;
  questionType: string;
  questionTypeId: number;
}

export interface ICorrectionQuestionViewModel {
  examId: number;
  examName: string;
  examStudentId: string;
  teacherName: string;
  teacherUserId: string;
  questionId: number;
  questionName: string;
  imageAttach: any;
  studentUserId: number;
  studentAnswer: string;
  questionMark: number;
  prefectAnswer: string;
}
