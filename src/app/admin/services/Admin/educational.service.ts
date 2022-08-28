import { environment } from "environments/environment";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class EducationalService {
  //General
  yearByStageURL = environment.apiURL + "Admin/educationalYear/";

  constructor(private http: HttpClient) {}

  //Get Educational Entities
  getEducationalEntities() {
    return this.http.get(environment.apiURL + "Admin/getEducationalEntities");
  }

  //Add New Educational Entities
  addNewEducationalEntity(data: any) {
    return this.http.post(
      environment.apiURL + "Admin/addNewEducationalEntity",
      data
    );
  }

  //Remove Educational Entities
  removeEducationalEntity(id: any) {
    return this.http.post(
      environment.apiURL + "Admin/removeEducationalEntity/" + id,
      null
    );
  }

  ///////////////////////////////////////////////////////////////

  //Get Educationa Stage
  getEducationaStages() {
    return this.http.get(environment.apiURL + "Admin/getEducationaStages");
  }

  //Add New Educational Stage
  AddEducationalStage(countryID: any, stageName: any) {
    //stageID
    return this.http.post(
      `${environment.apiURL}Admin/AddEducationalStage/${countryID}/${stageName}`,
      null
    );
  }

  //Edit Educational Stage
  EditEducationalStage(StageID: any, countryID: any, stageName: any) {
    //stageID
    return this.http.post(
      `${environment.apiURL}Admin/EditEducationalStage/${StageID}/${countryID}/${stageName}`,
      null
    );
  }

  //Delete Educational Stage
  DeleteEducationalStage(StageID: any) {
    //stageID
    return this.http.post(
      `${environment.apiURL}Admin/RemoveEducationalStage/${StageID}`,
      null
    );
  }

  //return Stages By teacherId
  getStageByTeacherId(teacherId: any) {
    return this.http.get(`${environment.apiURL}AJAX/returnStages/${teacherId}`);
  }

  ///////////////////////////////////////////////////////////////

  //Get Educationa Years
  getEducationalYear() {
    return this.http.get(environment.apiURL + "Admin/educationalYear");
  }

  //Add New Educational Year
  AddEducationalYear(data: any) {
    //eduYearID, stageID, eduYearName
    return this.http.post(environment.apiURL + "Admin/educationalYear", data);
  }

  //delete Educational Year
  deleteEducationalYear(id: any) {
    return this.http.delete(`${environment.apiURL}Admin/educationalYear/${id}`);
  }

  //Get Educationa  Stage By CountryID
  getEducationalStageByCountryID<T>(countryID: any) {
    return this.http.get<T>(`${environment.apiURL}Admin/stages/${countryID}`);
  }
  //return Years BY stageId

  returnYears(stageId: any) {
    return this.http.get(
      `${environment.apiURL}AJAX/GetEducationalYearOfStudents/${stageId}`
    );
  }

  //return Teacher Subjects   //{ "yearId" : 36, "teacherId" : 17}
  returnTeacherSubjects(data: any) {
    return this.http.post(
      `${environment.apiURL}AJAX/returnSubjectsByYearTeacherIDs`,
      data
    );
  }

  //return Units BY SubjectId
  GetUnits(SubjectId: any) {
    return this.http.get(environment.apiURL + "AJAX/GetUnits/" + SubjectId);
  }

  //return Lessons BY unitId
  GetLessons(unitId: any) {
    return this.http.get(`${environment.apiURL}AJAX/GetLessons/${unitId}`);
  }

  //return Topics BY LessonId
  GetTopics(LessonId: any) {
    return this.http.get(environment.apiURL + "AJAX/GetTopics/" + LessonId);
  }

  //get Year by StageID
  getYearbyStageID(stageID: any) {
    return this.http.get(
      `${environment.apiURL}Admin/educationalYear/${stageID}`
    );
  }

  matBySbjectURL =
    environment.apiURL + "codes/returnMaterialsByMainSubjectTeacherId/";
  GetMaterialsBySubject(subjectId: any, teacherId: any, EduCompId: any) {
    return this.http.get(
      `${`${environment.apiURL}codes/returnMaterialsByMainSubjectTeacherId/${subjectId}`}/${teacherId}/${EduCompId}`
    );
  }
}
