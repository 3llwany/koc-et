export interface IStudentClassCalenderDetailsModel {
  TeacherName: string;
  SubjectName: string;
  ClassLink: string;
  HomeWorks: IClassCalenderHomeWork[];
  HelperFiles: IClassCalenderHelperFile[];
}

export interface IClassCalenderHomeWork {
  ClassCalenderAttachId: number;
  HomeWorkAttachFileName: string;
  HomeWorkAttachFilePath: string;
  HomeWorkAnswers: IStudentClassCalenderHomeWork[];
}

export interface IStudentClassCalenderHomeWork {
  StudentClassCalenderId: number;
  AnswerAttachFileName: string;
  AnswerAttachFilePath: string;
}

export interface IClassCalenderHelperFile {
  ClassCalenderId: Number;
  HelperFileAttachFileName: String;
  HelperFileAttachFilePath: string;
}

export interface IClassViewModel {
  ClassCalenderId: number;
  ClassName: string;
  ClassDate: Date;
}

export interface IHomeworkSolutionModel {
  ClassCalenderAttachId: number;
  UserId: number;
  CreationDate: Date;
  EndDate: Date;
  thumbnailFiles: IFileToUpload[];
}

export interface IFileToUpload {
  name: string;
  size: string;
  type: string;
  LastModified: number;
  LastModifiedDate: Date;
  FileAsBase64: string;
}
