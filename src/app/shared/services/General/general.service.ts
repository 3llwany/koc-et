import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class GeneralService {
  constructor(private http: HttpClient) {}

  getAllEduCompList() {
    return this.http.get(environment.apiURL + "EduComponent");
  }

  returnProfile() {
    return this.http.get(environment.apiURL + "AJAX/returnProfile");
  }

  editProfile(data: any) {
    return this.http.post(environment.apiURL + "AJAX/editProfile", data);
  }

  getAllEduStagesList<T>() {
    return this.http.get<T>(environment.apiURL + "AJAX/getStages");
  }

  getEduYearByStageId<T>(stageId: any) {
    return this.http.get<T>(
      environment.apiURL + "AJAX/getEducationalYear/" + stageId
    );
  }

  getSubjectsByYearId<T>(yearId: any) {
    return this.http.get<T>(environment.apiURL + "AJAX/getSubjects/" + yearId);
  }

  getTeachersBySubjectId<T>(subjectId: any) {
    return this.http.get<T>(
      environment.apiURL + "AJAX/getTeachers/" + subjectId
    );
  }

  getTeachersMaterials<T>(subjectId: number, teacherId: number) {
    return this.http.get<T>(
      environment.apiURL +
        `AJAX/returnMaterialsByMainSubjectTeacherId/${subjectId}/${teacherId}`
    );
  }

  getUserBoughtedMaterials<T, TE>(data: TE) {
    return this.http.post<T>(
      environment.apiURL + "AJAX/getUserMaterialsByTeacherSubject",
      data
    );
  }

  getEduCompByUser<T>() {
    return this.http.get<T>(
      environment.apiURL + "AJAX/returnEducationalComponentByUser"
    );
  }

  getBranchesByEduComp<T>(EduCompId: number) {
    return this.http.get<T>(
      `${environment.apiURL}usermanagement/returBranchesByEduCompId/${EduCompId}`
    );
  }

  returnStages(teacherId: any) {
    return this.http.get(environment.apiURL + "AJAX/returnStages/" + teacherId);
  }

  getAllCountriesList<T>() {
    return this.http.get<T>(environment.apiURL + "Admin/getAllCountriesList");
  }

  getTeachersByEducompId(EduCompId: any) {
    return this.http.get(
      environment.apiURL + "Admin/get-all-teachers/" + EduCompId
    );
  }

  getSubjectByTeacherId(teacherId: any) {
    return this.http.get(
      environment.apiURL + "Admin/get-all-lectures/" + teacherId
    );
  }

  getAllNotifications(yearId: any, page: any) {
    return this.http.get(
      environment.apiURL +
        "AJAX/returnNotificationsByUserId/" +
        yearId +
        "/" +
        page
    );
  }

  ReadNotification(id: any) {
    return this.http.get(environment.apiURL + "AJAX/ReadNotification/" + id);
  }
}
