export interface dalyTable {
  Day: string;
  List: List[];
}

export interface List {
  ClassLink: string;
  DayName: string;
  FromHour: Date;
  Id: number;
  SubjectName: string;
  TeacherName: string;
  ToHour: Date;
  lecture_Name: string;
  TeacherPicture: string;
}
