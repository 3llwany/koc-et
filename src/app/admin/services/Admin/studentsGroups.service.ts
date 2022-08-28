import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class StudentsGroupsService {
  constructor(private http: HttpClient) {}

  addStudyingGroup(body: any) {
    return this.http.post(
      `${environment.apiURL}studyinggroup/save-studying-groups`,
      body
    );
  }

  getStudentsGroups(body: any) {
    return this.http.post(
      `${environment.apiURL}studyinggroup/return-studying-groups`,
      body
    );
  }

  getGroupById(id: any) {
    return this.http.get(
      `${environment.apiURL}studyinggroup/get-group-by-Id/${id}`
    );
  }

  RemoveStudentGroup(groupId: number) {
    return this.http.get(
      `${environment.apiURL}studyinggroup/delete-by-Id/${groupId}`
    );
  }

  searchStudents(body: any) {
    return this.http.post(
      `${environment.apiURL}studyinggroup/search-student-groups`,
      body
    );
  }

  checkStudent(body: any) {
    return this.http.post(
      environment.apiURL + "studyinggroup/search-student-in-group",
      body
    );
  }

  addStudent(studentId: number, groupId: number) {
    return this.http.get(
      `${environment.apiURL}studyinggroup/add-student-groups/${studentId}/${groupId}`
    );
  }

  deleteStudent(studentId: number, groupId: number) {
    return this.http.get(
      `${environment.apiURL}studyinggroup/remove-student-groups/${studentId}/${groupId}`
    );
  }

  uploadStudentsByExcel(body: any) {
    return this.http.post(
      environment.apiURL + "studyinggroup/upload-excel-student-groups",
      body
    );
  }
}
