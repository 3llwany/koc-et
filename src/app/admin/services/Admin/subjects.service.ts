import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class SubjectsService {
  constructor(private http: HttpClient) {}

  getSubjects(data: any) {
    return this.http.post(environment.apiURL + "Admin/subject", data);
  }

  getMainSubject() {
    return this.http.get(environment.apiURL + "Admin/getAllSubjects");
  }

  getSubjectByID(id: any) {
    return this.http.get(environment.apiURL + "Admin/getSubjectByID/" + id);
  }

  addEditSubject(data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/EducationalSubject`,
      data
    );
  }

  deleteSubject(id: any) {
    return this.http.delete(`${environment.apiURL}Admin/subject/${id}`);
  }

  getTeacherBySubjectAndEduCompId(EduCompId: any, subjectId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/getTeachersByEduCompID/${EduCompId}/${subjectId}`
    );
  }

  addQuestionSettings(EdueCompId: any, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/subjectStudentQuestionSettings/${EdueCompId}`,
      data
    );
  }

  addTemplateSettings(data: any) {
    return this.http.post(
      environment.apiURL + "Admin/subjectStudentTemplateSettings/",
      data
    );
  }

  getSubjectStructre(subjectId: any) {
    return this.http.get(
      environment.apiURL + "Admin/subjectStructure/" + subjectId
    );
  }

  getUnitById(id: any) {
    return this.http.get(environment.apiURL + "Admin/EditUnitView/" + id);
  }

  addUpdateUnit(data: any) {
    return this.http.post(
      environment.apiURL + "Admin/AddSubjectUnitPost",
      data
    );
  }

  deleteUnit(id: any) {
    return this.http.post(environment.apiURL + "Admin/RemoveUnit/" + id, null);
  }

  getLessonById(id: any) {
    return this.http.get(environment.apiURL + "Admin/EditLessonView/" + id);
  }

  addUpdateLesson(unitId: any, data: any) {
    return this.http.post(
      environment.apiURL + "Admin/AddSubjectLessonPost/" + unitId,
      data
    );
  }

  deleteLesson(id: any) {
    return this.http.post(
      environment.apiURL + "Admin/RemoveLesson/" + id,
      null
    );
  }

  getTopicsByLessonId(page: any, LessonId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/GetTopicsByLessonIdTable/${page}/${LessonId}`
    );
  }

  getTopicById(LessonId: any, id: any) {
    return this.http.get(
      environment.apiURL + "Admin/getTopicById/" + LessonId + "/" + id
    );
  }

  addUpdateTopic(data: any) {
    return this.http.post(environment.apiURL + "Admin/SubmitTopic", data);
  }

  deleteTopic(id: any) {
    return this.http.post(environment.apiURL + "Admin/RemoveTopic/" + id, null);
  }
}
