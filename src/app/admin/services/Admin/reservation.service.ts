import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  InputSettings(viewId: any) {
    return this.http.get(`${environment.apiURL}AJAX/InputSettings/${viewId}`);
  }

  SubmitInputsSettings(data: any) {
    return this.http.post(environment.apiURL + "AJAX/InputSettings", data);
  }

  returnBranchesByEduCompId<T>(EduCompId: any) {
    return this.http.get<T>(
      `${environment.apiURL}AJAX/returnBranchesByEduCompId/${EduCompId}`
    );
  }

  GetAvaliableDatesByBranchId(
    BranchId: any,
    MustHaveStudents: boolean,
    DontShowMaxed: boolean
  ) {
    return this.http.get(
      `${`${environment.apiURL}AJAX/GetAvaliableDatesByBranchId/${BranchId}`}/${MustHaveStudents}/${DontShowMaxed}`
    );
  }

  returnCities<T>() {
    return this.http.get<T>(environment.apiURL + "AJAX/returnCities");
  }

  getArea<T>() {
    return this.http.get<T>(environment.apiURL + "AJAX/returnArea");
  }

  returnStatus<T>() {
    return this.http.get<T>(environment.apiURL + "AJAX/returnStatus");
  }

  getReservationsList<T, TE>(data: T) {
    return this.http.post<TE>(
      environment.apiURL + "AJAX/returnReservations",
      data
    );
  }

  ReservationDetails(id: any) {
    return this.http.get(`${environment.apiURL}AJAX/ReservationDetails/${id}`);
  }

  getReservationEdit<T>(id: any, EduCompId: any) {
    return this.http.get<T>(
      `${environment.apiURL}AJAX/ReservationEdit/${id}/${EduCompId}`
    );
  }

  SubmitReservationEdit(data: any) {
    return this.http.post(environment.apiURL + "AJAX/ReservationEdit", data);
  }

  GetStudentStatus(Id: any, EduCompId: any) {
    return this.http.get(
      `${environment.apiURL}AJAX/ReservationStatus/${Id}/${EduCompId}`
    );
  }

  SubmitReservationStatus(data: any) {
    return this.http.post(environment.apiURL + "AJAX/ReservationStatus", data);
  }

  ReservationStatusPaging<T>(page: any, EduCompUserId: any) {
    return this.http.get<T>(
      `${environment.apiURL}AJAX/ReservationStatusPaging/${page}/${EduCompUserId}`
    );
  }

  getReasonsByStatusId<T>(StatusId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/returnReasonsByStatusId/${StatusId}`
    );
  }

  updateStudentCustomDiscount(body: any) {
    return this.http.post(
      environment.apiURL + "CustomDiscountsUsers/SaveCustomDiscountUser",
      body
    );
  }

  getStudentCustomDiscount<T>(userId: any) {
    return this.http.get<T>(
      `${environment.apiURL}CustomDiscountsUsers/returnUserCustomDiscountDetails/${userId}`
    );
  }

  getCustomDiscount<T>(EduCompId: any) {
    return this.http.get<T>(
      `${environment.apiURL}CustomDiscountsUsers/returnCustomDiscountsByEduCompId/${EduCompId}`
    );
  }

  getStudentCustomDiscountsList<T>(userId: any) {
    return this.http.get<T>(
      `${environment.apiURL}CustomDiscountsUsers/returnUserCustomDiscountsByUserId/${userId}`
    );
  }

  getCustomReservation(EduCompId: any) {
    return this.http.get(
      environment.apiURL + "Reservations/CustomReservation/" + EduCompId
    );
  }

  returnBranchesByEducTypeId<T>(typeId: any, EduCompId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Reservations/returnCenterBranchesByEducationalTypeId/${typeId}/${EduCompId}`
    );
  }

  addReservationDate<T, TV>(data: T) {
    return this.http.post<TV>(
      `${environment.apiURL}reservation/add-date`,
      data
    );
  }

  getAllReservationDate<T>(page: number) {
    return this.http.get<T>(`${environment.apiURL}reservation/get-all/${page}`);
  }

  downloadTemplate() {
    return this.http.get(
      environment.apiURL + "reservation/download-date-template"
    );
  }

  getAvailableGroups(teacherId: any, EduCompId: any) {
    return this.http.get(
      `${environment.apiURL}Reservations/returnAvailableStudyingGroupsByTeacherId/${teacherId}/${EduCompId}`
    );
  }

  CompletaReservation(data: any) {
    return this.http.get(
      `${environment.apiURL}Reservations/reservationPaymentAndAddStudentToGroup/${data.groupId}/${data.teacherUserId}/${data.eduCompId}`
    );
  }

  getReservationInfo<T>(EduCompId: number) {
    return this.http.get<T>(
      `${environment.apiURL}Reservations/returnReservationInfo/${EduCompId}`
    );
  }

  checkUserBalance(EduCompId: any, teacherId: any) {
    return this.http.get(
      `${environment.apiURL}Reservations/isUserHasBalanceForCustomTeacher/${EduCompId}/${teacherId}`
    );
  }
}
