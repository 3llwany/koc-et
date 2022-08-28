
export interface IReportIndexViewModel {
    ReportId: number;
    ReportNameAr: string;
}

export interface IReportParameterModel {
    ReportId: number;
    ReportNameAr: string;
    IsFromDateParameter: boolean;
    IsFromToParameter: boolean;
    IsCenterParameter: boolean;
    IsTeacherParameter: boolean;
    IsStudentParameter: boolean;
}

export interface IReportSearchModel {
    ReportId: number;
    FromDate: string;
    ToDate: string;
    CenterIds: number[];
    TeacherId: number;
    StudentId: number;
}


export interface ICenterDropModel {
    Code: string;
    Id: number;
    Name: string
}

export interface ITeacherDropModel {
    TeacherId: number;
    TeacherName: string;
}

export interface IStudentDropModel {
    StudentId: number;
    StudentName: string;
}


export interface ICenterIdsSearchModel {
    CenterIds: number[]
    Search: string;
    Page: number;
}

// ------------------------------------
export interface ILecturesExamsViewsCountModel {
    CenterIds: number[]
    TeacherId: number;
    Page: number;
}

export interface IResultReportModel<T> {
    data: T;
    totalItems: number;
}
export interface ILecturesExamsViewsCountLecturesDetailsModel {
    MaterialName: string;
    Count: number;
    InsideCount: number;
    OutsideCount: number;
    MaterialId: number;
    EduCompId: number;
}
export interface ILecturesExamsViewsCountExamsDetailsModel {
    MaterialName: string;
    Count: number;
    InsideCount: number;
    OutsideCount: number;
    MaterialId: number;
    EduCompId: number;
}
export interface ILecturesExamsViewsCountCenterLecturesDetailsModel {
    LectureName: string;
    Count: number;
    MaterialId: number;
    EduCompId: number;
}
export interface ILecturesExamsViewsCountLiveLecturesDetailsModel {
    LectureName: string;
    Count: number;
    MaterialId: number;
    EduCompId: number;
}

// ------------------------------------
export interface IStudentsFollowUpModel {
    CenterIds: number[]
    StudentId: number;
    Page: number;
}

export interface IExamStudentReportModel {
    SubjectName: string;
    ExamName: string;
    ExamGrade: number;
    StudentGrade: number;
}

export interface IMaterialStudentReportModel {
    SubjectName: string;
    MaterialType: string;
    MaterialName: string;
    PurchaseDate: string;
    LastViewDate: string;
    ViewsNumber: number;
}

// ------------------------------------
export interface IManualPaymentModel {
    CenterIds: number[]
    FromDate: string;
    ToDate: string;
}


// ------------------------------------
export interface IReservationModel {
    CenterIds: number[]
    TeacherId: number;
}

// ------------------------------------
export interface IFinancialModel {
    CenterIds: number[]
    TeacherId: number;
    FromDate: string;
    ToDate: string;
}
// ####################################
// ------------------------------------
export interface ILectureCodesModel {
    CenterIds: number[]
    TeacherId: number;
}