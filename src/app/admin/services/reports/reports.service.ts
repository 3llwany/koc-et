import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  getAllReportsIndexURL = environment.apiURL + "Admin/get-all-reports-index";
  getReportParametersURL = environment.apiURL + "Admin/get-report-paramters";

  getTeachersByCentersURL =
    environment.apiURL + "Admin/get-teachers-by-centers";
  getStudentsByCentersURL =
    environment.apiURL + "Admin/get-students-by-centers";

  lecturesExamsViewsCountLectureReportURL =
    environment.apiURL + "Admin/get-lectures-exams-views-count-lecture";
  lecturesExamsViewsCountExamReportURL =
    environment.apiURL + "Admin/get-lectures-exams-views-count-exam";
  lecturesExamsViewsCountCenterLectureReportURL =
    environment.apiURL + "Admin/get-lectures-exams-views-count--center-lecture";
  lecturesExamsViewsCountLiveLectureReportURL =
    environment.apiURL + "Admin/get-lectures-exams-views-count-live-lecture";

  studentAbsenceReportExcelURL =
    environment.apiURL + "Admin/get-student-absence-report-excel";
  studentPresentReportExcelURL =
    environment.apiURL + "Admin/get-student-present-report-excel";
  guestStudentPresentReportExcelURL =
    environment.apiURL + "Admin/get-student-guest-present-report-excel";

  // -------------------------------------
  examStudentNameReportURL = environment.apiURL + "Admin/get-exam-student-name";
  examStudentReportURL = environment.apiURL + "Admin/get-exam-student-lecture";
  materialStudenReportURL =
    environment.apiURL + "Admin/get-material-student-lecture";

  // -------------------------------------
  getManualPaymentReportExcelURL =
    environment.apiURL + "Admin/get-manual-payment-report-excel";

  // -------------------------------------
  getReservationReportExcelURL =
    environment.apiURL + "Admin/get-reservation-report-excel";

  // -------------------------------------
  getFinancialSummarReportExcelURL =
    environment.apiURL + "Admin/get-financial-summary-report-excel";

  // -------------------------------------
  getFinancialDetailsReportExcelURL =
    environment.apiURL + "Admin/get-financial-details-report-excel";

  // #####################################################
  // -------------------------------------
  getLecturesSalesReportExcelURL =
    environment.apiURL + "Admin/get-lecture-sales-report-excel";

  // -------------------------------------
  getFinancialReportExcelURL =
    environment.apiURL + "Admin/get-financial-report-excel";

  // -------------------------------------
  getMaterialCodesReportExcelURL =
    environment.apiURL + "Admin/get-material-codes-report-excel";

  constructor(private http: HttpClient) {}

  getAllReportsIndex<T>() {
    return this.http.get<T>(this.getAllReportsIndexURL);
  }

  getReportParameters<T>(reportId: number) {
    return this.http.get<T>(this.getReportParametersURL + "/" + reportId);
  }

  getTeachersByCenters<T, TV>(obj: T) {
    return this.http.post<TV>(this.getTeachersByCentersURL, obj);
  }

  getStudentsByCenters<T, TV>(obj: T) {
    return this.http.post<TV>(this.getStudentsByCentersURL, obj);
  }

  // -----------------------------------------------------
  lecturesExamsViewsCountLectureReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      this.lecturesExamsViewsCountLectureReportURL,
      obj
    );
  }
  lecturesExamsViewsCountExamReport<T, TV>(obj: T) {
    return this.http.post<TV>(this.lecturesExamsViewsCountExamReportURL, obj);
  }
  lecturesExamsViewsCountCenterLectureReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      this.lecturesExamsViewsCountCenterLectureReportURL,
      obj
    );
  }
  lecturesExamsViewsCountLiveLectureReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      this.lecturesExamsViewsCountLiveLectureReportURL,
      obj
    );
  }

  getStudentAbsenceReportExcel(
    selectId: number,
    eduCompId: number,
    typeId: number
  ) {
    return this.http.get(
      this.studentAbsenceReportExcelURL +
        "/" +
        selectId +
        "/" +
        eduCompId +
        "/" +
        typeId
    );
  }
  getStudentPresentReportExcel(
    selectId: number,
    eduCompId: number,
    typeId: number
  ) {
    return this.http.get(
      this.studentPresentReportExcelURL +
        "/" +
        selectId +
        "/" +
        eduCompId +
        "/" +
        typeId
    );
  }
  getGuestStudentPresentReportExcel(
    selectId: number,
    eduCompId: number,
    typeId: number
  ) {
    return this.http.get(
      this.guestStudentPresentReportExcelURL +
        "/" +
        selectId +
        "/" +
        eduCompId +
        "/" +
        typeId
    );
  }

  // -----------------------------------------------------
  examStudentNameReport<T, TV>(obj: T) {
    return this.http.post<TV>(this.examStudentNameReportURL, obj);
  }
  examStudentReport<T, TV>(obj: T) {
    return this.http.post<TV>(this.examStudentReportURL, obj);
  }
  materialStudenReport<T, TV>(obj: T) {
    return this.http.post<TV>(this.materialStudenReportURL, obj);
  }

  // -----------------------------------------------------
  getManualPaymentReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(this.getManualPaymentReportExcelURL, obj);
  }

  // -----------------------------------------------------
  getReservationReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(this.getReservationReportExcelURL, obj);
  }

  // -----------------------------------------------------
  getFinancialSummaryReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(this.getFinancialSummarReportExcelURL, obj);
  }

  // -----------------------------------------------------
  getFinancialDetailsReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(this.getFinancialDetailsReportExcelURL, obj);
  }

  // #####################################################
  // -----------------------------------------------------
  getLecturesSalesReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(this.getLecturesSalesReportExcelURL, obj);
  }

  // -----------------------------------------------------
  getFinancialReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(this.getFinancialReportExcelURL, obj);
  }

  // -----------------------------------------------------
  getMaterialCodesReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(this.getMaterialCodesReportExcelURL, obj);
  }
}
