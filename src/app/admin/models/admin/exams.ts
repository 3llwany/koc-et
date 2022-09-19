import { IMaterialVM } from "./educations";
export interface question {
  questionID: number;
  questionName: string;
  questionTypeArabicName: string;
  questionTypeEnglishName: string;
  lessonName: string;
  levelName: string;
  mark: number;
  subjectName: string;
  topicName: string;
  unitName: string;
}

//Exam
export interface IExamVM {
  AllMaterialsBought: boolean;
  Avilable_Date_From: Date;
  Avilable_Date_To: Date;
  CreationDate: Date;
  CustomDiscount: number;
  CustomDiscountApplied: boolean;
  Discount: number;
  DiscountType: number;
  EduCompId: number;
  Individually_Purchased: boolean;
  IsAvaliable: boolean;
  IsSolved: boolean;
  Lesson_ID: number;
  Purchased: boolean;
  ResultDate: Date;
  ResultTime: string;
  SemesterID: number;
  SendWhatsApp: any;
  StudentRepeatExamCost: any;
  Subject_ID: number;
  Template_userId: number;
  Unit_ID: number;
  exam_ar_name: string;
  exam_en_name: string;
  exam_period_minute: number;
  fromHour: number;
  id: number;
  isPublish: number;
  main_subject_id: number;
  price: number;
  priceAfterDiscount: number;
  quiz: number;
  repeatableExam: boolean;
  repeatableExam_Count: number;
  requiredMarkToPass: number;
  state: boolean;
  studentMark: number;
  teacher_ID: number;
  teacher_subject_id: number;
  templateID: number;
  toHour: number;
}

// templates
export interface ITemplateVM {
  AllMaterialsBought: boolean;
  Avilable_Date_From: Date;
  Avilable_Date_To: Date;
  CreationDate: Date;
  CustomDiscount: number;
  CustomDiscountApplied: boolean;
  EduCompId: number;
  Id: number;
  Individually_Purchased: boolean;
  IsAvaliable: boolean;
  IsSolved: number;
  LessonID: number;
  Name: string;
  Publish: boolean;
  Purchased: boolean;
  ResultDate: Date;
  ResultTime: Date;
  SendWhatsApp: any;
  StudentRepeatExamCost: number;
  SubjectRevisionID: number;
  UnitRevisionID: number;
  exam_period_minute: number;
  fromHour: number;
  price: number;
  priceAfterDiscount: number;
  priceDiscount: number;
  priceDiscountType: number;
  repeatableExam: boolean;
  repeatableExam_Count: number;
  requiredMarkToPass: number;
  studentMark: number;
  subjectId: number;
  teacheSubjectrId: number;
  toHour: number;
  userId: number;
}

export interface studentCreatedExamsVM {
  CreatedBy: string;
  Subject: string;
  Grade: {
    exam_grade: number;
    student_grade: number;
  };
  Id: number;
  Name: string;
  Type: string;
}

export interface TemplateVM {
  Id: number;
  Name: string;
  Subject: string;
  Year: string;
  Teacher: string;
  isPublish: boolean;
}

export interface TemplateDetailsVM {
  Id: number;
  LessonID: number;
  SubjectRevisionID: number;
  TopicID: number;
  UnitRevisionID: number;
  mark: number;
  questionsCount: number;
  questionsLevel: number;
  templateId: number;
  SubjectName: string;
  UnitName: string;
  LessonName: string;
  TopicName: string;
}

export interface IGetMatAttachedQuizVM {
  Id: number;
  examId: number;
  templateId: number;
  materialId: number;
  percentageToPass: number;
  MaterialsAttachDetails: IMaterialVM;
  TemplateDetails: ITemplateVM[];
  examDetails: IExamVM[];
}
export interface IMcqChoiceVM {
  choice_id: number;
  choice_text: string;
  thumbnailPic: any;
  ChoiceAttachPath: string;
  remove_image: boolean;
  //  IsCorrect: boolean;
}
export interface IQuestionVM {
  difficulty_level: 1;
  lessonId: string;
  main_subject_id: string;
  mark: 4;
  perfect_answer: string;
  picked_choice_index: 2;
  question_ar_text: string;
  question_attach: string;
  question_id: number;
  question_type_id: 2;
  teacherUserId: 22;
  topicId: string;
  unitId: string;
  choices: IMcqChoiceVM[];
}
export interface IDifficultyLevelVM {
  Id: 1;
  level_ar_name: string;
  level_en_name: string;
}
