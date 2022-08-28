export interface userData {
  picturePath: string;
  user: {
    user_ID: number;
    account_email: string;
    account_password: string;
    IsAdmin: any;
    profilePictureId: number;
    ar_name: string;
    mobile: string;
    credits: number;
    IsTestAccount: boolean;
    fullyRegistered: boolean;
    verified: boolean;
    userTypeId: number;
  };
}

//Countries
export interface country {
  country_id: number;
  country_ar_name: string;
}

//Stages By CountryId
export interface stageByCountry {
  id: number;
  CountryID: number;
  stage_ar_name: string;
  stage_en_name: string;
  country_ar_name: string;
  country_en_name: string;
}

//Years By StageId
export interface YearsByStage {
  id: number;
  Educational_year_ar_name: string;
  Educational_year_en_name: string;
}

//student
export interface student {
  user_ID: number;
  reserveId: number;
  account_email: string;
  ar_name: string;
  code: string;
}

export interface ErrorClass {
  key: string;
  error: string;
}

export interface teacherByEduCompId {
  teacherUserId: number;
  teacher_ar_name: string;
}

export interface ISubjectByTeacherId {
  Value: number;
  Text: string;
}

export interface GeneralDropdownVM {
  Value: number;
  Text: string;
  Text_Ar: string;
}

export interface IUserVM {
  ConfirmPassword: any;
  IsAdmin: any;
  IsTestAccount: any;
  RegistrationReferCode: any;
  account_email: string;
  account_password: string;
  ar_name: string;
  code: any;
  country_id: number;
  creationDate: string;
  credits: number;
  date_of_birth: string;
  description: string;
  fullyRegistered: boolean;
  gender_id: number;
  gov_id: number;
  hobbies: string;
  mobile: string;
  profilePictureId: number;
  userTypeId: number;
  user_ID: number;
  TeacherId: number;
  verified: boolean;
}

export interface IStageDropVM {
  stage_id: number;
  stage_name: string;
}

export interface IYearDropVM {
  educational_year_id: number;
  educational_year_name: string;
}

export interface studyingGroupsDropVM {
  EduCompId: number;
  Id: number;
  IsHidden: boolean;
  Publish: boolean;
  currentYear: number;
  groupName: string;
  maxLimit: number;
  subjectId: number;
  teacherId: number;
}

export interface IEducationalCompsVM {
  Code: string;
  Name: string;
  Id: number;
}
export interface IBranchesVM {
  CurrentYearPaymentURL: string;
  EduCompId: number;
  Id: number;
  Name: string;
  PaymentURL: string;
  districtId: number;
  districtName: string;
  state: boolean;
}

export interface IRowFunctionVM {
  Action: any;
  Controller: any;
  Id: number;
  cssClass: string;
  functionGroupId: number;
  functionName: string;
  functionParameters: string;
  functionRank: string;
  functionURL: string;
  function_en_name: string;
  parentFunctionId: number;
  state: boolean;
}

export interface statutsDropVM {
  Ar_Name: string;
  En_Name: string;
  Id: number;
}

export interface ICodeDetailsVM {
  id: number;
  code: string;
  serial: number;
  teacher_ar_name: string;
  material_name: string;
  userId: number;
  user_ar_name: string;
  mobile: string;
  account_email: string;
}

export interface EditEduDataVM {
  parentPhoneNumber: string;
  parentName: string;
  EduYearID: number;
  stageID: number;
}
export interface IEduCompVM {
  Id: number;
  Name: string;
  ParentDatamandatory: boolean;
  RegistrationReferCode: string;
  acceptanceStatus: any;
  deniedComment: any;
}

export interface ISubjectVM {
  reateBranchId: number;
  CreationDate: Date;
  CreationUserId: number;
  EditedDate: Date;
  EditedUserId: number;
  Educational_yearID: number;
  Parent_ID: number;
  Revisions: any;
  UpdateBranchId: number;
  attach_path: string;
  centerId: number;
  country_ar_name: string;
  country_id: number;
  discountPrice: number;
  docAttachCount: number;
  educational_year: any;
  examCount: number;
  matCount: number;
  offlineMatCount: number;
  parent_ID: number;
  price: number;
  stage_id: number;
  stage_name: string;
  state: boolean;
  subjectCode: string;
  subjectDate: "2019-01-01T00:00:00";
  subjectDescription: string;
  subjectEndDate: string;
  subjectPromoVideoPath: string;
  subjectThumb: string;
  subjectThumbnailFileBase: any;
  subjectThumbnailFileBase64: any;
  subjectThumbnailId: number;
  subject_ar_name: string;
  subject_en_name: string;
  subject_id: number;
  subject_main_id: number;
  totalPrice: number;
}
