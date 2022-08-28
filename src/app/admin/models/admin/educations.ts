import { country } from "app/shared/models/general/general";

//Educational Entities
export interface Entity {
  ID: number;
  Name: string;
  Eduacation_Entity_Type: EntitiesTypes;
}

//Educational Entities types
export interface EntitiesTypes {
  ID: number;
  Name: string;
}

//Educational Stages
export interface Stage {
  stage: {
    id: number;
    stage_ar_name: string;
    stage_en_name: string;
    CountryID: number;
    EnglishStage: boolean;
    state: boolean;
    ImagePath: string;
    StageCountr: number;
  };
  stageCountryName: string;
}

//Educational Years
export interface year {
  id: number;
  Educational_year_ar_name: string;
  Educational_year_en_name: string;
  state: true;
  StageID: number;
  stage_name: string;
  country_info: country;
}

//#region Subjects

//Educational subject
export interface subject {
  subject_id: number;
  subject_ar_name: string;
  educational_year: string;
  stage_name: string;
}

//unit
export interface unit {
  SesemesterID: number;
  discountPrice: number;
  docAttachCount: number;
  examCount: number;
  firstMaterialId: number;
  id: number;
  matCount: number;
  offlineMatCount: number;
  state: boolean;
  subjectid: number;
  thumbnailPic: any;
  totalPrice: number;
  unitDescription: string;
  Description: string;
  unitThumbnailId: number;
  unit_ar_name: string;
  unit_en_name: string;
}

//lesson
export interface lesson {
  UnitID: number;
  discountPrice: number;
  docAttachCount: number;
  examCount: number;
  firstMaterialId: number;
  id: number;
  lessonDescription: string;
  lessonThumbnailId: number;
  lesson_ar_name: string;
  lesson_en_name: string;
  matCount: number;
  offlineMatCount: number;
  semesterID: number;
  state: boolean;
  thumbnailPic: any;
  totalPrice: number;
}

//Topic
export interface topic {
  LessonID: number;
  id: number;
  state: boolean;
  topic_ar_name: string;
  topic_en_name: string;
}

// Subject Structer
export interface structer {
  lessons: lesson[];
  unit: unit;
}

//Educational Subject Question Students Settings
export interface QuestionStudentsSettings {
  Id: number;
  subjectId: number;
  EduCompId: number;
  teacherSubjectId: number;
  typeId: number;
  IsPublic: number;
  PublicPrice: number;
  PrivatePrice: number;
  IfPublicAccessibleAfterLecturesCount: number;
}

//Teacher By subjectId and EduCompId
export interface teacherBySubEduComp {
  //teacher_ID: number;
  teacherUserId: number;
  teacher_Subject_ID: number;
  teacher_ar_name: string;
}

export interface ISearchMaterialVM {
  p: number;
  searchedItemId: number;
  searchedItemType: number;
  searchedTeacherId: number;
}

//Material
export interface IMaterialVM {
  materialId: number;
  Address: string;
  BoughtByCodeOnly: boolean;
  CodeIsPurchasable: boolean;
  CustomDiscount: number;
  CustomDiscountApplied: any;
  DateInserted: string;
  EduCompId: number;
  IsActive: boolean;
  IsAvaliable: boolean;
  IsOnline: boolean;
  IsPublish: boolean;
  IsReportDeleted: any;
  LessonID: number;
  NotsolvedQuizCount: number;
  Num_views: number;
  Purchased: boolean;
  SemesterID: number;
  SubjectID: number;
  UnitID: number;
  VdoCipherId: number;
  attach_path: string;
  attach_type_id: number;
  buyByCode: boolean;
  buyByCredit: boolean;
  code_price: number;
  file_type_id: number;
  fromDate: string;
  id: number;
  main_subject_id: number;
  material_name: string;
  prerequisite_material_id: number;
  prerequisite_material_required_score: number;
  price: number;
  priceDiscount: any;
  priceDiscountType: number;
  promoVideoPath: string;
  quizCount: number;
  sproutVideo: string;
  state: boolean;
  teacher_ID: number;
  toDate: Date;
  currentSubject?: subject;
  selectedItemType?: number;
  selectedItemId?: number;
  materialName?: string;
}

export interface IGetMaterialVM {
  retunValue: number;
  model: IMaterialVM;
}

export interface IOfflineLectureAttendeeslVM {
  amountRefunded: any;
  dateRefunded: any;
  didAttend: string;
  didRefund: any;
  groupName: string;
  isExceptionstring: string;
  lectureName: string;
  username: string;
}
export interface IGetOfflineLectureAttendeeslVM {
  model: IOfflineLectureAttendeeslVM[];
  itemsCount: number;
}

//Material Part
export interface IPartVM {
  materialId: number;
  Id: number;
  videoTypeId: number;
  view_percentage: number;
  Name: string;
  Path: string;
  PaSecondaryPathth: string;
  Views_Limit: number;
  VimeoID: number;
  canStudentWatch: any;
  studentExtraViews: number;
  studentViews: number;
}
export interface IGetPartVM {
  MaterialPart: IPartVM;
}

//Material file
export interface Attache {
  Id: number;
  attachId: number;
  file: string;
  materialId: number;
  materialName: string;
}

//#endregion

export interface IUploadSubjectSyllabusModel {
  subjectId: number;
  thumbnailFile: IFileToUpload;
}

export interface IFileToUpload {
  name: string;
  size: string;
  type: string;
  lastModified: number;
  lastModifiedDate: Date;
  fileAsBase64: string;
}

export interface subjectsDropdownVM {
  Value: number;
  Text: string;
}

export interface GeneralDropdownVM {
  Value: number;
  Text: string;
  Text_Ar: string;
}

export interface IRefundLectureVM {
  userId: number;
  RefundedLectureId: number;
}
export interface IBoughtedMaterialsTeacherVM {
  teacherUserId: number;
  subjectId: number;
  notStudent: boolean;
  studentUserId: number;
}

export interface IBoughtedMaterialsTeacherStudentVM {
  teacherUserId: number;
  subjectId: number;
}

export interface userPaymentsHistories {
  Date: Date;
  Payment_MethodsAr: String;
  Payment_MethodsEn: String;
  item: any;
  typeName: String;
  part_name: String;
  subject_ar_name: String;
}
