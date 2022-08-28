import { Time } from "@angular/common";
import { IUserVM } from "app/shared/models/general/general";

export interface IReservationVM {
  CenterBranchName: string;
  CreationDate: Date;
  CenterCode: number;
  statusId: number;
  StudentCode: string;
  Id: number;
  Name: string;
  UserName: string;
  Status: Status;
  status: String;
  TimeObject: TimeObject;
  StudentNumber: string;
  StudentWhatsAppNumber: string;
  WebCode: number;
  RegistrationDate: Date;
  ReservationDate: Date;
  Discount: CustomDiscountDropMV;
  Group: [
    {
      studyingGroup: StudentGroupVM;
      teacherName: string;
    }
  ];
}

export interface IGetReservationListVM {
  list: IReservationVM[];
  itemsCount: number;
  pageCounts: number;
}

export interface ISearchReservationVM {
  EduCompId: number;
  email: string;
  name: string;
  mobile: string;
  code: string;
  branchId: number;
  groupId: number;
  statusId: number;
  cityId: number;
  currentYear: number;
  page: number;
}

export interface Status {
  Ar_Name: string;
  En_Name: string;
  Notes: string;
  Id: number;
  userId: number;
}

export interface TimeObject {
  Branch: string;
  Date: Date;
  EduCompId: number;
  FromTime: Date;
  ToTime: Date;
}

export interface city {
  country_id: number;
  gov_ar_name: string;
  gov_en_name: string;
  gov_id: number;
  state: boolean;
}

export interface IAreaVM {
  Ar_Name: string;
  En_Name: string;
  Id: number;
}

export interface StudentGroupVM {
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

export interface StudentStatusListVM {
  Code: StudentStatusCodeListVM;
  FromDate: Date;
  ToDate: Date;
  Id: number;
  Name: string;
  Note: string;
  Group: StudentGroupVM;
  Status: Status;
  Reason: StatusReasons;
}

export interface StudentStatusCodeListVM {
  Code: string;
  EduCompId: number;
  EduComp_DepId: any;
  Email: string;
  Id: number;
  Mobile: string;
  Name: string;
  counter: number;
  userId: number;
}

export interface StatusReasons {
  Id: number;
  statusId: number;
  reasonText: string;
}

export interface CustomDiscountDropMV {
  Id: number;
  teacherId: number;
  Amount: number;
  EduCompId: number;
  Ar_Name: string;
  En_Name: string;
  PreviewName: string;
  Teacher: string;
}

export interface StudentCustomDiscountsListMV {
  UserDetails: IUserVM;
  CustomDiscountDetails: CustomDiscountDropMV;
  Teacher: string;
}
export interface IStudentCustomDiscountsMV {
  User: IUserVM;
  Discount: CustomDiscountDropMV;
  Id: number;
  note: string;
}

export interface CenterBranchesVM {
  CurrentYearPaymentURL: string;
  EduCompId: number;
  Id: number;
  Name: string;
  PaymentURL: string;
  districtId: 2;
  districtName: string;
  state: string;
}

export interface EducationTypesVM {
  Ar_Name: string;
  En_Name: string;
  Id: number;
}

export interface EducationalDivisionsVM {
  Ar_Name: string;
  En_Name: string;
  Id: number;
}

export interface GendersVM {
  gender_ar_name: string;
  gender_en_name: string;
  gender_id: number;
}

export interface GovernmentsVM {
  country_id: number;
  gov_ar_name: string;
  gov_en_name: string;
  gov_id: number;
  state: boolean;
}

export interface ReligionsVM {
  Ar_Name: string;
  En_Name: string;
  Id: number;
}

export interface Areas {
  Ar_Name: string;
  En_Name: string;
  Id: number;
}

export interface IReservationDateModel {
  file: IFileToUpload;
  branchIds: number[];
}

export interface IFileToUpload {
  name: string;
  size: string;
  type: string;
  LastModified: number;
  LastModifiedDate: Date;
  FileAsBase64: string;
}
export interface IReservationResponse {
  IsAddSuccess: boolean;
  Message: string;
}

export interface IReservationViewModel {
  reservationDateList: IReservationDateViewModel[];
  itemsCounts: number;
}
export interface IReservationDateViewModel {
  branchName: string;
  date: Date;
  fromTime: Date;
  toTime: Date;
  maxLimit: number;
  finalFromTime: string;
  finalToTime: string;
}
export interface IStudentReservationVM {
  Address: string;
  Area: number;
  CenterBranchId: number;
  City: number;
  Competitions: string;
  CreateBranchId: number;
  CreationDate: string;
  CreationUser: number;
  DeletionDate: Date;
  DeletionUser: number;
  EduCompId: number;
  EducationTypeId: number;
  EducationalDivision: any;
  EmployeeSignature: any;
  FatherMobile: string;
  FatherWhatsAppNumber: string;
  Gender: number;
  GuardianJob: string;
  Hobbies: string;
  HomeTelephone: string;
  Id: number;
  LastUpdatedDate: Date;
  LastUpdatedUser: number;
  MotherMobile: string;
  MotherWhatsAppNumber: string;
  ProfilePicture_Path: string;
  Religion: number;
  SchoolName: string;
  SentviewId: number;
  StudentNumber: string;
  StudentWhatsAppNumber: string;
  UpdateBranchId: number;
  UserName: string;
  Workshops: string;
  centerId: number;
  currentYear: number;
  state: any;
  status: string;
  statusId: number;
  studentId: number;
  userId: number;
}

export interface ISubmitReservationEditVM {
  Reservation: IStudentReservationVM;
  profilePicture: any;
}

export interface IGetReservationEditVM {
  Religion: ReligionsVM[];
  Gender: GendersVM[];
  EducationalDivision: EducationalDivisionsVM[];
  EducationTypeId: EducationTypesVM[];
  Area: Areas[];
  CenterBranches: CenterBranchesVM[];
  Reservation: IStudentReservationVM;
  profilePicture: any;
}
