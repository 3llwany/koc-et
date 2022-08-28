import {
  IEduCompVM,
  ISubjectVM,
  IUserVM,
} from "./../../shared/models/general/general";
export interface IStudentDataVM {
  email: string;
  mobile: string;
  UserPaymentsHistory: any;
  year: any;
  center_names: string;
  user: IUserVM;
}

export interface ISearchStudentVM {
  email: string;
  mobile: string;
}

export interface IPostResetPasswordVM {
  account_email: string;
  mobile: string;
}

export interface IResetPasswordVM {
  model: IUserVM;
  newPassword: string;
}

export interface ICaseVM {
  CASE_TYPE_ID: number;
  CASE_STATUS_ID: number;
  CASE_Contact: string;
  CASE_source_ID: number;
  CASE_Date: Date;
  CASE_Details: string;
  CASE_Comment: string;
  CASE_USER_ID: number;
  Case_ID: number;
}
export interface ICaseTableVM {
  CASE_Comment: string;
  CASE_Contact: string;
  CASE_Date: Date;
  CASE_Details: string;
  CASE_STATUS_ID: number;
  CASE_STATUS_Name: string;
  CASE_TYPE_ID: number;
  CASE_TYPE_Name: string;
  CASE_USER_ID: number;
  CASE_USER_Name: string;
  CASE_source_ID: number;
  CASE_source_Name: string;
  Case_ID: number;
}
export interface IGetCaseVM {
  userName: string;
  caseType: ICaseTypeVM[];
  caseStatus: ICaseStatusVM[];
  caseSource: ICaseSourceVM[];
}

export interface ICaseSourceVM {
  id: number;
  source_name: string;
}

export interface ICaseStatusVM {
  id: number;
  CASE_STATUS1: string;
}

export interface ICaseTypeVM {
  id: number;
  CASE_TYPE1: string;
}

export interface IRefundBalanceVM {
  user: IUserVM;
  teacherUserId: number;
  EduCompId: number;
  withdraw: number;
  EduComps: IEduCompVM[];
  teachers: any[];
}
export interface IPostRefundBalanceVM {
  withdraw: number;
  teacherId: number;
  EduCompId: number;
  user: {
    user_ID: number;
  };
}

export interface IGenerateCodeStudentDataVM {
  studentSubjects: ISubjectVM[];
  userEmail: string;
  userID: number;
  userMobile: string;
  userName: string;
}

export interface ITeacherVM {}
export interface ILecturesVM {}
