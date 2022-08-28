export interface point {
  AbsenceValue: any;
  AttendanceValue: any;
  ByQuestion: boolean;
  Id: number;
  MaterialId: number;
  QuestionAttempts: number;
  Value: number;
}
export interface TemplatePoint {
  ByQuestion: boolean;
  ExamId: number;
  FromValue: number;
  Id: number;
  TemplateId: number;
  ToValue: number;
  Value: number;
}
