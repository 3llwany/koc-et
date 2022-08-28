import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ManageViewsService {
  constructor(private http: HttpClient) {}

  searchStudent(EduCompId: any, body: any) {
    return this.http.post(
      `${environment.apiURL}Admin/searchUSer/${EduCompId}`,
      body
    );
  }

  resetViews(EduCompId: any, body: any) {
    return this.http.post(
      `${environment.apiURL}Admin/resetViewsCount/${EduCompId}`,
      body
    );
  }

  addExceptionalViews(EduCompId: any, body: any) {
    return this.http.post(
      `${environment.apiURL}Admin/ExceptionalViewsResetCount/${EduCompId}`,
      body
    );
  }
}
