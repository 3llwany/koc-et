import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class SearchStudentsService {
  constructor(private http: HttpClient) {}

  getStudentsByEduCompId(EduCompId: any, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/getStudents/${EduCompId}`,
      data
    );
  }

  getStudentBalance(userId: any, EduCompId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/returnBalanceCheck/${userId}/${EduCompId}`
    );
  }

  getStudentPayments<T>(EduCompId: any, page: number, userId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/returnUserPayments/${EduCompId}/${page}/${userId}`
    );
  }

  getStudentPaymentsHistory<T>(EduCompId: any, page: number, userId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/returnUserPaymentsHistory/${EduCompId}/${page}/${userId}`
    );
  }

  getStudentStatus(userId: any, EduCompId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/educationalCompStatus/${userId}/${EduCompId}`
    );
  }

  deleteStudent(EduCompId: number, id: any) {
    return this.http.post(
      `${environment.apiURL}Admin/RemoveEducationalComponent_User/${EduCompId}/${id}`,
      null
    );
  }

  getStudentGroupsAndStatuts(EduCompId: number) {
    return this.http.get(
      `${environment.apiURL}Admin/JoinStudentsEducationalComponent/${EduCompId}`
    );
  }

  getStudentStatusList(page: number, EduCompUserId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/ReservationStatusPaging/${page}/${EduCompUserId}`
    );
  }

  updateStudentStatus(EduCompId: number, body: any) {
    return this.http.post(
      `${environment.apiURL}Admin/EduCompStatus/${EduCompId}`,
      body
    );
  }

  getUserDataRefundLecture(userId: any) {
    return this.http.get(`${environment.apiURL}Admin/RefundLecture/${userId}`);
  }

  refundLecture(body: any) {
    return this.http.post(environment.apiURL + "Admin/RefundLecture", body);
  }

  getStudentCode(EduCompId: number, userId: number) {
    return this.http.get(
      `${environment.apiURL}Admin/ChangeStudentCode/${EduCompId}/${userId}`
    );
  }

  updateStudentCode(EduCompId: number, body: any) {
    return this.http.post(
      `${environment.apiURL}Admin/ChangeStudentCode/${EduCompId}`,
      body
    );
  }
}
