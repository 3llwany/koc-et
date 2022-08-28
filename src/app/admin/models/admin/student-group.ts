export interface studentGroupVM {
  EduCompId: number;
  Id: number;
  IsHidden: boolean;
  Publish: boolean;
  currentYear: number;
  Name: string;
  maxLimit: number;
  Subject: number;
  Teacher: number;
}

export interface searchStudentVM {
  InGroup: boolean;
  student: studentVM;
}

export interface studentVM {
  Email: string;
  Mobile: string;
  Name: string;
  studentId: number;
  userId: number;
}
