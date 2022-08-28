import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class TeacherRequistesService {
  constructor(private http: HttpClient) {}

  getTeachingRequests(eduCompID: any, page: any) {
    return this.http.get(
      `${environment.apiURL}Admin/getTeachingRequests/${eduCompID}/${page}`
    );
  }

  changeTeachingRequest(id: any, isAccepted: any) {
    return this.http.get(
      `${environment.apiURL}Admin/replyToTeachingRequest/${id}/${isAccepted}`
    );
  }
}
