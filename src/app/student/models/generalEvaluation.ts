export interface GeneralEvaluation {

  examCount: number;
  examGrades: number;
  giftPoints: number;
  lesson_exams: object[];
  matCount: number;
  quizzes: object[];
  select_Child: number;
  specificSubject: null
  student: Array<any>;
  studentExamCount: number;
  studentGrades: number;
  subject_exams: object[];
  subjectsCount: number;
  subjectsCountList: [{
    currentSubjectExamsCount: number;
    currentSubjectStudentExamsCount: number;
    currentSubjectVideosCount: number;
    subject_ar_name: string;
  }];

  unit_exams: object[];
}
