export interface LiveLecture {
  EduCompId: number;
  HoursBeforeRelease: number;
  Id: number;
  actualDate: any;
  lectureDate: string;
  lectureEndDate: string;
  lectureName: string;
  lecturePrice: number;
  lectureState: number;
  lectureZoomId: string;
  maxLimit: number;
  presentedBy: string;
  TeacherNameAr: string;
  TeacherNameEn: string;
  SubjectName: string;
  teacher_subject_id: number;
  typeId: number;
}

export interface liveLectureTable {
  Date: string;
  DateTimeTemp: string;
  Day: string;
  IsPublished: boolean;
  LiveLectureDateId: number;
  StudyingGroups: string;
  StudyingGroupsList: any;
  Time: string;
}

export interface LiveLectureGroups {
  StudentGroupId: number;
  udentGroupName: string;
}
