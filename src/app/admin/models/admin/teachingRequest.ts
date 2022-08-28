export interface TeachingRequest {
  userName: string;
  Id: number;
  TeacherEduCompReqSubjectsId: number;
  eduCompId: number;
  userId: number;
  CV: any;
  accepted: boolean;
  subjectName: string;
  teacherDesc: string;
  teacherName: string;
}

export interface teacherSubjectIndexVM {
  id: number;
  subject_ID: number;
  EducationYearName: string;
  subjectName: string;
  teacher_ID: number;
}
