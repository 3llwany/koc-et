import { IFileToUpload } from "app/student/models/homework";

export interface IAddExamNightModel {
  subjectId: number;
  thumbnailFile: IFileToUpload;
}

export interface IExamNightViewModel {
  subjectArName: string;
  subjectEnName: string;
  attachpath: string;
}
