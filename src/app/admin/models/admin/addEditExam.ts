import { NumberValueAccessor } from "@angular/forms";

export interface IAddEditExamHeaderModel {
  exam_hour: number;
  exam_minute: number;
  exam_type_id: number;
  exam: IAddEditExamModel;
}

export interface IAddEditExamModel {
  id: number;
  isPublish: number;
  exam_ar_name: string;
  Avilable_Date_From: string;
  Avilable_Date_To: string;
  subject_ID: number;
  unit_ID: number;
  lesson_ID: number;
  teacherUserId: number;
  teacher_subject_id: number;
  price: number;
  DiscountType: number;
  Discount: number;
  EduCompId: number;
  fromHour: string;
  toHour: string;
  ResultDate: string;
  ResultTime: string;
  repeatableExam: boolean;
  repeatableExam_Count: number;
  Individually_Purchased: boolean;
  StudentRepeatExamCost: number;
  CustomDiscountApplied: boolean;
  SendWhatsApp: boolean;
  exam_hour: number;
  exam_minute: number;
}

export interface IExamResponse {
  exam: IExamResponseInDetails;
}

export interface IExamResponseInDetails {
  AllMaterialsBought: boolean;
  Avilable_Date_From: string;
  Avilable_Date_To: string;
  CreationDate: string;
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
  ResultDate: string;
  ResultTime: string;
  SemesterID: number;
  SendWhatsApp: boolean;
  StudentRepeatExamCost: number;
  Subject_ID: number;
  Template_userId: number;
  Unit_ID: number;
  exam_ar_name: string;
  exam_en_name: string;
  exam_period_minute: number;
  fromHour: string;
  id: number;
  isPublish: boolean;
  main_subject_id: number;
  price: number;
  priceAfterDiscount: number;
  quiz: any;
  repeatableExam: boolean;
  repeatableExam_Count: number;
  requiredMarkToPass: boolean;
  state: boolean;
  studentMark: number;
  teacherUserId: number;
  teacher_subject_id: number;
  templateID: number;
  toHour: string;
  countryId: number;
  examHours: number;
  examMinutes: number;
  examTypeId: number;
  stageId: number;
  eduYearId: number;
}
