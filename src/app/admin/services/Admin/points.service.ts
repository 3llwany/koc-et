import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class PointsService {
  constructor(private http: HttpClient) {}

  addLecturePoint(body: any) {
    return this.http.post(environment.apiURL + "Admin/addCustomPoint", body);
  }

  getLecturePoints(page: any, materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/addCustomPoint${page}/${materialId}`
    );
  }

  deleteLecturePoint(pointId: any) {
    return this.http.delete(
      `${environment.apiURL}Admin/addCustomPoint${pointId}`
    );
  }

  addExamPoint(body: any) {
    return this.http.post(environment.apiURL + "Admin/addCustomPoint", body);
  }

  getExamPoints(page: any, materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/addCustomPoint${page}/${materialId}`
    );
  }

  deleteExamPoint(pointId: any) {
    return this.http.delete(
      `${environment.apiURL}Admin/addCustomPoint${pointId}`
    );
  }
}
