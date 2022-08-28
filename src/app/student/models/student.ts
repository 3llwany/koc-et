import { ISubjectVM, IUserVM } from "app/shared/models/general/general";
import { IEduCompVM } from "./../../shared/models/general/general";
import { IMaterialVM } from "app/admin/models/admin/educations";
import { IExamVM, ITemplateVM } from "app/admin/models/admin/exams";

export interface IMyTeachersMV {
  userTeachers: ITeachersListMV[];
  otherTeachers: ITeachersListMV[];
}

export interface ITeachersListMV {
  userId: number;
  teacherSubjectId: number;
  subjectId: number;
  arName: string;
  subjectName: string;
  profilePic: string;
}

export interface ITeacherSubjectsVM {
  exam_count: number;
  lesson_has_materials_exams: boolean;
  lesson_id: number;
  list_teachersubject_has_lessonmaterial_or_lessonexam: any;
  list_teachersubject_has_material_or_exam: ITeacherSubjectsListVM[];
  mat_count: number;
  materialCount: number;
  page: number;
  selectedChild: number;
  showAll: boolean;
  stageId: number;
  stages: any;
  subject_has_materials_exams: boolean;
  subject_id: number;
  teacherId: number;
  teachersList: any;
  teachersubjectId: number;
  unit_has_materials_exams: boolean;
  unit_id: number;
  yearId: number;
}
export interface ITeacherSubjectsListVM {
  exam_count: number;
  mat_count: number;
  subject_educational_year_id: number;
  subject_id: number;
  subject_name: string;
  subject_stage_id: number;
  subject_year_name: string;
  teacher_id: number;
  teacher_name: string;
  teacher_picture: string;
  teacher_subject_id: number;
}

export interface ITeacherDataVM {
  ar_name: string;
  attach_path: string;
  Description: string;
  subjectName: ITeacherSabjectDataVM[];
  EduCompId: number;
  banner_path: string;
}

export interface ITeacherSabjectDataVM {
  subject_ar_name: string;
  subject_en_name: string;
}
export interface ITeacherDataPostVM {
  subject_id: string;
  teacherUserId: string;
}

export interface ITeacherSubjectFilesVM {
  // teacher: number;
  teacherUserId: number;
  subject: number;
  teacher_subject: number;
}

export interface ISubjectChaptersVM {
  lessons: IChaptersLessonsVM[];
  liveLectures: any;
  mlazem: any[];
  packages: any[];
  showAll: boolean;
  studentId: number;
  type: number;
  subjectRevisions: IChaptersSubjectRevisionsVM[];
  subject_name: string;
  teacher_name: string;
  subjects: any;
  teacher_subject: IChaptersTeacherSubjectVM;
  unitRevisions: IChaptersUnitRevisionsVM[];
}

export interface IChaptersLessonsVM {
  UnitID: number;
  attach_path: string;
  discountPrice: number;
  docAttachCount: number;
  examCount: number;
  firstMaterialId: number;
  id: number;
  lessonDescription: string;
  lessonThumb: string;
  lessonThumbnailId: number;
  lesson_ar_name: string;
  lesson_en_name: string;
  matCount: number;
  offlineMatCount: number;
  semesterID: number;
  state: boolean;
  thumbnailPic: string;
  totalPrice: number;
}
export interface IChaptersSubjectRevisionsVM {
  Educational_yearID: number;
  Revisions: any;
  attach_path: string;
  country_ar_name: string;
  country_id: number;
  discountPrice: number;
  docAttachCount: number;
  educational_year: number;
  examCount: number;
  matCount: number;
  offlineMatCount: number;
  parent_ID: number;
  price: number;
  stage_id: number;
  stage_name: string;
  state: boolean;
  subjectCode: string;
  subjectDate: Date;
  subjectDescription: string;
  subjectEndDate: Date;
  subjectPromoVideoPath: string;
  subjectThumb: string;
  subjectThumbnailFileBase: string;
  subjectThumbnailFileBase64: string;
  subjectThumbnailId: number;
  subject_ar_name: string;
  subject_en_name: string;
  subject_id: number;
  subject_main_id: number;
  totalPrice: number;
}

export interface IChaptersUnitRevisionsVM {
  id: number;
  matCount: number;
  unit_ar_name: string;
  unitDescription: string;
}

export interface IChaptersTeacherSubjectVM {
  bannerId: number;
  id: number;
  price: number;
  subjectPromoVideoId: number;
  subject_ID: number;
  teacherSubjectDescription: string;
  teacher_ID: number;
}

export interface IChapterMaterialsVM {
  matType: number;
  select_Child: number;
  studentId: number;
  materialsList: IMaterialVM[];
}

export interface IPostMaterialListVM {
  id: number;
  //teacher: number;
  teacherUserId: number;
  subject: number;
  teacher_subject: number;
  type: number;
}

export interface IPostLiveLectureVM {
  teacherId: number;
  // teacherUserId: number;
  subjectId: number;
  teacherSubjectId: number;
  studentId: number;
}

export interface IPostExamChapterVM {
  id: number;
  type: number;
  showAll: boolean;
}

export interface IGetLiveLectureVM {
  List: ILiveLectureVM[];
}

export interface ILiveLectureVM {
  Date: {
    Date: Date;
    Id: number;
    IsPublish: boolean;
    Purchased: boolean;
    liveLectureId: number;
    LectureData: ILectureDataVM;
  };
}

export interface ILectureDataVM {
  EduCompId: number;
  HoursBeforeRelease: number;
  Id: number;
  SubjectId: number;
  TeacherId: number;
  actualDate: Date;
  lectureDate: string;
  lectureEndDate: string;
  lectureName: string;
  lecturePrice: number;
  lectureState: number;
  lectureZoomId: string;
  maxLimit: number;
  presentedBy: string;
  teacher_subject_id: number;
  typeId: number;
}

export interface IGetSubjectsExamsVM {
  SubjectID: number;
  TeacherID: number;
  TeacherSubjectID: number;
  examList: IExamVM[];
  examPagingList: any;
  examStudentList: any;
  examSubjects: any;
  examType: number;
  select_Child: number;
  studentId: number;
  templates: ITemplateVM[];
}

export interface ITopExamStudentsVM {
  ExamName: string;
  ProfilePicture: string;
  examGrade: number;
  giftPoints: number;
  studentGrade: number;
  userId: number;
  userName: string;
}

export interface ITopStudentsVM {
  ProfilePicture: string;
  GiftPoints: number;
  Name: string;
  userId: number;
}

export interface IFileDocumentVM {
  select_Child: number;
  studentId: number;
  matType: number;
  materialsList: IMaterialVM[];
}
export interface IPaymentsTeachersVM {
  EduComp: IEduCompVM;
  ar_name: string;
  attach_path: string;
  serviceProvider: number;
  teacherUserId: number;
}
export interface ISubjectEvaluationVM {
  user: IUserVM;
  specificSubject: ISubjectVM;
  subjectsCount: number;
  matCount: number;
  examCount: number;
  studentExamCount: number;
  giftPoints: number;
  examGrades: number;
  studentGrades: number;
  select_Child: number;
  subjectsCountList: [];
  solvedExams: {
    subject_exams: IEvaluationExamVM[];
    unit_exams: IEvaluationExamVM[];
    lesson_exams: IEvaluationExamVM[];
    quizzes: IEvaluationExamVM[];
  };

  unSolvedExams: {
    subject_exams: IEvaluationExamVM[];
    unit_exams: IEvaluationExamVM[];
    lesson_exams: IEvaluationExamVM[];
    quizzes: IEvaluationExamVM[];
  };
}

export interface IEvaluationExamVM {
  examGrade: number;
  examID: number;
  examName: string;
  lessonName: string;
  studentGrade: number;
  unitName: string;
}

export interface IEvaluationMaterialsVM {
  subscribedLectures: {
    offline: IEvaluationMaterialsLectureVM;
    online: IEvaluationMaterialsLectureVM;
  };
  unSubscribedLectures: {
    offline: IEvaluationMaterialsLectureVM;
    online: IEvaluationMaterialsLectureVM;
  };
}

export interface IEvaluationMaterialsLectureVM {
  IsOnline: boolean;
  IsPublish: boolean;
  id: number;
  materialName: string;
  subjectId: number;
  subjectName: string;
  teacherName: string;
  teacherUserId: number;
  teacher_subject: number;
}

export interface IGetStudentStageVM {
  eduYearName: string;
  returnedList: {
    Id: number;
    educationalYearId: number;
    studentUserId: number;
  };
  selectedStageId: number;
  selectedYearId: number;
  stageId: number;
  stageName: string;
  stages: null;
  student: {
    CreateBranchId: number;
    CreationDate: Date;
    CreationUserId: number;
    EditedDate: Date;
    EditedUserId: number;
    Eduacation_Entity_ID: number;
    UpdateBranchId: number;
    centerId: number;
    country_id: number;
    currentCredits: number;
    educational_year_id: number;
    mobile: string;
    parent2Name: string;
    parent2PhoneNumber: string;
    parentName: string;
    parentPhoneNumber: string;
    state: boolean;
    student_ID: number;
    student_name: string;
    user_id: number;
  };
}
