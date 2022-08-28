import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class CashPaymentService {
  constructor(private http: HttpClient) {}

  CashPaymentSearch(body: any, EduCompId: any) {
    return this.http.post(
      `${environment.apiURL}CashPayment/returnUserDataByPhoneNumber/${EduCompId}`,
      body
    );
  }

  CashPaymentPost(EduCompId: any, body: any) {
    return this.http.post(
      `${environment.apiURL}CashPayment/CashPaymentPost/${EduCompId}`,
      body
    );
  }

  GetItemsByLesson(
    EduCompId: number,
    lessonId: number,
    itemTypeId: number,
    teacherId: number
  ) {
    return this.http.get(
      `${`${environment.apiURL}CashPayment/returnItemsByLessonId`}/${EduCompId}/${lessonId}/${itemTypeId}/${teacherId}`
    );
  }

  GetItemsByUnit(
    EduCompId: number,
    unitId: number,
    itemTypeId: number,
    teacherId: number
  ) {
    return this.http.get(
      `${`${environment.apiURL}CashPayment/returnItemsByUnitId`}/${EduCompId}/${unitId}/${itemTypeId}/${teacherId}`
    );
  }

  GetItemsBySubject(
    EduCompId: number,
    subjectId: number,
    itemTypeId: number,
    teacherId: number
  ) {
    return this.http.get(
      `${`${environment.apiURL}CashPayment/returnItemsBySubjectId`}/${EduCompId}/${subjectId}/${itemTypeId}/${teacherId}`
    );
  }

  GetItemsByLessonWithEnded(
    EduCompId: number,
    lessonId: number,
    itemTypeId: number,
    teacherId: number,
    ended: boolean
  ) {
    return this.http.get(
      `${`${environment.apiURL}CashPayment/returnItemsByLessonIdSpecialViews`}/${EduCompId}/${lessonId}/${itemTypeId}/${teacherId}/${ended}`
    );
  }

  geItemPrice(id: number, userId: number) {
    return this.http.get(
      `${environment.apiURL}CashPayment/returnMaterialPriceById/${id}/${userId}`
    );
  }

  getPaymentsHistory(p: number, userId: any) {
    return this.http.get(
      `${environment.apiURL}CashPayment/returnUserPaymentsHistoryTable/${p}/${userId}`
    );
  }

  ManualPaymentByExcel(EduCompId: number, body: any) {
    return this.http.post(
      `${environment.apiURL}CashPayment/postManualPaymentByExcel/${EduCompId}`,
      body
    );
  }
}
