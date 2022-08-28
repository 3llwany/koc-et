import { subject } from "./../../admin/models/admin/educations";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class SupportService {
  constructor(private http: HttpClient) {}

  searchStudent<T, TE>(data: TE) {
    return this.http.post<T>(environment.apiURL + "SearchUser/Index", data);
  }

  CowpayReferenceSearch(cowPayId: string) {
    return this.http.get(
      environment.apiURL + "CowPay/VerifyCowPayPayment/" + cowPayId
    );
  }
  resetPassword<T, TE>(data: T) {
    return this.http.post<TE>(
      environment.apiURL + "ResetPassword/resetUserPassword",
      data
    );
  }

  //##########################################################################
  getCase<T>(userId: number, caseId: number) {
    return this.http.get<T>(
      environment.apiURL + `CaseScreen/returnCase/${userId}/${caseId}`
    );
  }

  getCaseTable<T>(userId: number) {
    return this.http.get<T>(
      environment.apiURL + `CaseScreen/CaseTable/${userId}`
    );
  }

  AddEditCase<T>(data: T) {
    return this.http.post<T>(
      environment.apiURL + "CaseScreen/AddEditCase",
      data
    );
  }
  //##########################################################################

  getRefundBalanceData<T>(userId: number) {
    return this.http.get<T>(
      environment.apiURL + "RefundBalance/Refund/" + userId
    );
  }

  RefundBalance<T>(data: T) {
    return this.http.post<T>(environment.apiURL + "RefundBalance/Refund", data);
  }

  getStudentBalanceForTeacher(
    userId: number,
    teacherId: number,
    EduCompId: number
  ) {
    return this.http.get(
      environment.apiURL +
        `RefundBalance/returnUserBalanceByTeacherEduCompId/${userId}/${teacherId}/${EduCompId}`
    );
  }

  getStudentDataGenerateCode<T>(userId: number) {
    return this.http.get<T>(
      environment.apiURL + `AJAX/GenerateStudentCode/${userId}`
    );
  }

  GenerateCode(d: any) {
    return this.http.post(
      environment.apiURL +
        `AJAX/GenerateStudentCode/${d.teacherId}/${d.subjectId}/${d.materialId}/${d.userId}`,
      null
    );
  }

  getSubjects<T>() {
    return this.http.get<T>(environment.apiURL + "test");
  }

  getTeachersBySubjectId<T>(subjectId: number) {
    return this.http.get<T>(environment.apiURL + "test/" + subjectId);
  }

  getLectursByTeachersId<T>(teacherId: number) {
    return this.http.get<T>(environment.apiURL + "test/" + teacherId);
  }
}
