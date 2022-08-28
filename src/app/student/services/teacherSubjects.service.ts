import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class TeacherSubjectsService {
  constructor(private http: HttpClient) {}

  //Return Home Teachers
  ReturnHomeTeachers() {
    return this.http.get(environment.apiURL + "Teachers/HomeTeachers");
  }

  getMyTeachers<T>() {
    return this.http.get<T>(
      environment.apiURL + "AJAX/Teachers/returnStudentTeachers"
    );
  }

  //Return Teachers Payments By EduCompId
  TeachersPayments<T>() {
    return this.http.get<T>(
      environment.apiURL + "Teachers/returnTeacherPaymentsTest"
    );
  }

  //Return Center By User
  returnCenterByUser() {
    return this.http.get(environment.apiURL + "AJAX/returnCentersByUser");
  }

  ReturnTeacherSubjects<T>(id: any) {
    return this.http.post<T>(
      environment.apiURL + "Teachers/selectedTeacher",
      id
    );
  }

  ReturnTeacherData<T, TE>(data: TE) {
    return this.http.post<T>(
      environment.apiURL + "Teachers/getTeacherSummary",
      data
    );
  }

  ReturnSubjectChapters<T>(id: any) {
    return this.http.post<T>(
      environment.apiURL + "Teachers/TeacherSubjectData",
      id
    );
  }

  //Live Lectures
  ReturnLiveLectures<T>(data: any) {
    return this.http.post<T>(
      environment.apiURL + "Teachers/LiveLectures",
      data
    );
  }

  //Lectures List
  ReturneLecturesList<T, TE>(data: TE) {
    return this.http.post<T>(
      environment.apiURL + "AJAX/materialsByEntID",
      data
    );
  }

  // Offline Lectures List
  ReturneofflineLectures<T, TE>(data: TE) {
    return this.http.post<T>(
      environment.apiURL + "AJAX/returnOfflineMaterialsByEntId",
      data
    );
  }

  // Exams List
  ReturneExamsList<T>(data: any) {
    return this.http.post<T>(
      environment.apiURL + "AJAX/materialsByExamsID",
      data
    );
  }

  //Files List
  ReturneFilesList<T, TE>(data: TE) {
    return this.http.post<T>(
      environment.apiURL + "Teachers/getDocumentFiles",
      data
    );
  }

  // Return LTeacher Subject Evaluation
  LoadTeacherSubjectEvaluation(teacher_sub_id: any) {
    return this.http.get(
      environment.apiURL + "AJAX/LoadTeacherSubjectEvaluation/" + teacher_sub_id
    );
  }

  // Return Teacher Subjects By SubjectId
  returnTeacherSubjectsBySubjectId(pageId: any, SubjectId: any) {
    return this.http.get(
      `${environment.apiURL}AJAX/returnTeacherSubjectsBySubjectId/${pageId}/${SubjectId}`
    );
  }

  // Return Subject Structure
  returnSubjectStructure(SubjectId: any) {
    return this.http.get(
      environment.apiURL + "AJAX/viewSubjectPartialBySubjectId/" + SubjectId
    );
  }
}
