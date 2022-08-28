import { IFileToUpload } from "app/student/models/homework";

export interface IHomeworkModel {
  HomeWork: IHomeModel;
  file: IFileToUpload;
}

export interface IHomeModel {
  ClassCalendarId: number;
  Name: string;
}

export interface IMarkStudnetAnswer {
  Id: number;
  Notes: string;
  Mark: number;
}

export interface IClassCalendarAttachSearch {
  classCalendarAttachId: number;
  StudentName: string;
}

export interface IClassCalenderAttachResult {
  StudentName: string;
  StudentClassCalendarAttachId: number;
  Homework: IHomeworkAnswer[];
}

export interface IHomeworkAnswer {
  Attach: string;
  Mark: number;
  Notes: string;
}
