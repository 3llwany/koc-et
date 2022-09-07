import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  constructor(private http: HttpClient) {}

  getAllReportsIndex<T>() {
    return this.http.get<T>(environment.apiURL + "Admin/get-all-reports-index");
  }

  getReportParameters<T>(reportId: number) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/get-report-paramters/${reportId}`
    );
  }

  getTeachersByCenters<T, TV>(obj: T) {
    return this.http.post<TV>(
      `${environment.apiURL}Admin/get-teachers-by-centers`,
      obj
    );
  }

  getStudentsByCenters<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-students-by-centers",
      obj
    );
  }

  // -----------------------------------------------------
  lecturesExamsViewsCountLectureReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-lectures-exams-views-count-lecture",
      obj
    );
  }
  lecturesExamsViewsCountExamReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      `${environment.apiURL}Admin/get-lectures-exams-views-count-exam`,
      obj
    );
  }
  lecturesExamsViewsCountCenterLectureReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      `${environment.apiURL}Admin/get-lectures-exams-views-count--center-lecture`,
      obj
    );
  }
  lecturesExamsViewsCountLiveLectureReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-lectures-exams-views-count-live-lecture",
      obj
    );
  }

  getStudentAbsenceReportExcel(
    selectId: number,
    eduCompId: number,
    typeId: number
  ) {
    return this.http.get(
      `${`${environment.apiURL}Admin/get-student-absence-report-excel`}/${selectId}/${eduCompId}/${typeId}`
    );
  }
  getStudentPresentReportExcel(
    selectId: number,
    eduCompId: number,
    typeId: number
  ) {
    return this.http.get(
      `${environment.apiURL}Admin/get-student-present-report-excel/${selectId}/${eduCompId}/${typeId}`
    );
  }
  getGuestStudentPresentReportExcel(
    selectId: number,
    eduCompId: number,
    typeId: number
  ) {
    return this.http.get(
      `${environment.apiURL}Admin/get-student-guest-present-report-excel/${selectId}/${eduCompId}/${typeId}`
    );
  }

  // -----------------------------------------------------
  examStudentNameReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-exam-student-name",
      obj
    );
  }
  examStudentReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-exam-student-lecture",
      obj
    );
  }
  materialStudenReport<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-material-student-lecture",
      obj
    );
  }

  // -----------------------------------------------------
  getManualPaymentReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-manual-payment-report-excel",
      obj
    );
  }

  // -----------------------------------------------------
  getReservationReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-reservation-report-excel",
      obj
    );
  }

  // -----------------------------------------------------
  getFinancialSummaryReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-financial-summary-report-excel",
      obj
    );
  }

  // -----------------------------------------------------
  getFinancialDetailsReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-financial-details-report-excel",
      obj
    );
  }

  // -----------------------------------------------------
  getLecturesSalesReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-lecture-sales-report-excel",
      obj
    );
  }

  // -----------------------------------------------------
  getFinancialReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-financial-report-excel",
      obj
    );
  }

  // -----------------------------------------------------
  getMaterialCodesReportExcel<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "Admin/get-material-codes-report-excel",
      obj
    );
  }
}
