import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class LiveLectureService {
  constructor(private http: HttpClient) {}

  addEditLiveLecture(EduCompId: number, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/AddLiveLecture/${EduCompId}`,
      data
    );
  }

  getAllLiveLectures(EduCompId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/getAllLiveLectures/${EduCompId}`
    );
  }

  getLiveLectureById(id: number) {
    return this.http.get(environment.apiURL + "Admin/get-live-lecture/" + id);
  }

  CancelLiveLecture(id: any) {
    return this.http.post(
      `${environment.apiURL}Admin/CancelLiveLecture/${id}`,
      null
    );
  }

  DeleteLiveLecture(id: any) {
    return this.http.post(
      `${environment.apiURL}Admin/removeLiveLecture/${id}`,
      null
    );
  }

  getLectureGroups(liveLectureId: any, EduCompId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/get-all-live-lecture-groups/${liveLectureId}/${EduCompId}`
    );
  }

  LectureScheduling(data: any) {
    return this.http.post(
      environment.apiURL + "Admin/liveLectureScheduling/",
      data
    );
  }

  LectureTimeTable(LectureId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/liveLectureTimeTable/${LectureId}`
    );
  }

  updateLectureTimeTable(data: any) {
    return this.http.post(
      environment.apiURL + "Admin/editLiveLectureTimeDate",
      data
    );
  }

  DeleteLectureTimeTable(LectureId: any) {
    return this.http.post(
      `${environment.apiURL}Admin/deleteLiveLectureTimeDate/${LectureId}`,
      null
    );
  }

  publishLiveLecture(LectureId: any) {
    return this.http.post(
      `${environment.apiURL}Admin/publishDepublishLiveLecture/${LectureId}`,
      null
    );
  }
}
