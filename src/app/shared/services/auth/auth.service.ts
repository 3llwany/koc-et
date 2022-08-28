import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { environment } from "environments/environment";
import { BehaviorSubject, Subject } from "rxjs";

declare const $: any;
@Injectable({
  providedIn: "root",
})
export class AuthService {
  //ConstApi.apiURL +

  headers = new HttpHeaders().append("Content-Type", "application/json");

  constructor(private http: HttpClient, private router: Router) {}

  //#region Registeration

  // START Registeration
  Registeration<T, TE>(data: T) {
    return this.http.post<TE>(environment.apiURL + "APIUsers/Register", data);
  }

  // START LOGIN
  login<T, TE>(loginData: T) {
    return this.http.post<TE>(environment.apiURL + "user/login", loginData);
  }

  //START LOGOUT
  logout() {
    localStorage.clear();
    this.router.navigateByUrl("/home");
  }

  // START Forgot Password
  forgotPassword(email: any) {
    return this.http.post(
      environment.apiURL + "APIUsers/forgotPassword",
      email
    );
  }

  // START Reset Password
  resetPassword(data: any) {
    return this.http.post(
      environment.apiURL + "APIUsers/resetPasswordByVerificationCode",
      data
    );
  }

  getUserFunctions(branchId: any) {
    return this.http.get(
      `${environment.apiURL}usermanagement/return-functions/${branchId}`
    );
  }

  getUserRowFunctions(parentId: any) {
    return this.http.get(
      `${environment.apiURL}usermanagement/return-children-functions-by-parentId/${parentId}`
    );
  }

  //#endregion

  //#region  Chick Users
  //================= Start  Chick Users ==================
  isUser() {
    return !!localStorage.getItem("token");
  }

  isTeacher() {
    if (localStorage.getItem("user_type_Id") === "1") {
      return true;
    } else return false;
  }

  isStudent() {
    if (localStorage.getItem("user_type_Id") === "2") {
      return true;
    } else return false;
  }

  isParent() {
    if (localStorage.getItem("user_type_Id") === "3") {
      return true;
    } else return false;
  }

  isAdmin() {
    if (localStorage.getItem("user_type_Id") === "4") {
      return true;
    } else return false;
  }

  isCenter() {
    if (localStorage.getItem("user_type_Id") === "5") {
      return true;
    } else return false;
  }

  isSupport() {
    if (localStorage.getItem("user_type_Id") === "6") {
      return true;
    } else return false;
  }

  isFinancial() {
    if (localStorage.getItem("user_type_Id") === "7") {
      return true;
    } else return false;
  }

  isAssistant() {
    if (localStorage.getItem("user_type_Id") === "8") {
      return true;
    } else return false;
  }
  //#endregion

  // isUser GetToken
  getToken() {
    return localStorage.getItem("token") || null;
  }

  getEduCompId() {
    return localStorage.getItem("EduCompId");
  }

  getBranchId() {
    return localStorage.getItem("branchId");
  }

  EduCompId = new Subject<any>();
  branchId = new Subject<any>();
  setEduCompId(EduCompId) {
    localStorage.setItem("EduCompId", EduCompId || null);
    this.EduCompId.next({ EduCompId });
  }

  setBranchId(branchId) {
    localStorage.setItem("branchId", branchId || null);
    this.branchId.next({ branchId });
  }

  //Current YearId
  CurrentYearId() {
    return localStorage.getItem("yearId");
  }
} //end class
