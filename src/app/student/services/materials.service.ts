import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class MaterialsService {
  constructor(private http: HttpClient) {}

  ReturnMaterialByMatId(data: any) {
    return this.http.post(
      environment.apiURL + "Materials/getLessonPartsAndExams",
      data
    );
  }

  buyMaterialByCredit(id: any) {
    return this.http.post(environment.apiURL + "AJAX/buyMaterial/" + id, null);
  }

  subscribeMaterial(data: any) {
    return this.http.post(environment.apiURL + "AJAX/subscribeMaterial", data);
  }

  buyOfflineMaterial(id: any) {
    return this.http.post(
      environment.apiURL + "AJAX/buyOfflineMaterial/" + id,
      null
    );
  }

  //Check if Offline Material Has Online
  CheckifOfflineMaterialHasOnline(id: any) {
    return this.http.get(
      environment.apiURL + "AJAX/CheckifOfflineMaterialHasOnline/" + id
    );
  }

  //buy Exam
  buyExam(id: any) {
    return this.http.get(environment.apiURL + "AJAX/buyExam/" + id);
  }

  //buy Template
  buyTemplate(id: any) {
    return this.http.get(environment.apiURL + "AJAX/buyTemplate/" + id);
  }

  //Reset Exam Student
  ResetExamAsStudent(id: any) {
    return this.http.get(environment.apiURL + "AJAX/ResetExamAsStudent/" + id);
  }

  //Reset Template Student
  ResetTemplateAsStudent(id: any) {
    return this.http.get(
      environment.apiURL + "AJAX/ResetTemplateAsStudent/" + id
    );
  }

  //buy Live Lecture
  bookLecture(id: any) {
    return this.http.post(environment.apiURL + "AJAX/bookLecture/" + id, null);
  }

  // Get Quiz Times
  getQuizTimes(data: any) {
    return this.http.post(environment.apiURL + "Materials/getQuizTimes", data);
  }

  // Get Quiz
  getQuiz(data: any) {
    return this.http.post(environment.apiURL + "Materials/getQuiz", data);
  }

  //  Create View Row
  createViewRow(matId: any, partId: any) {
    return this.http.post(
      `${environment.apiURL}APIMaterials/createViewRow/${matId}/${partId}`,
      null
    );
  }

  // increment View + 1
  incrementView(matId: any, partId: any) {
    return this.http.post(
      `${environment.apiURL}APIMaterials/incrementView/${matId}/${partId}`,
      null
    );
  }
}
