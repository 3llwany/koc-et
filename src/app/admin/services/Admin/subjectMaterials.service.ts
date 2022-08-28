import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ISearchMaterialVM } from "app/admin/models/admin/educations";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class SubjectMaterialsService {
  getParts2URL = environment.apiURL + "Admin/returnMaterialPartsByMaterialId/";
  AttendanceURL = environment.apiURL + "Admin/postOfflineLectureView/";
  materialsattacAttendeesURL =
    environment.apiURL + "MaterialsAttach/offline-lecture-attendees/";

  constructor(private http: HttpClient) {}

  addEditMaterial(EduCompId: any, branchId: any, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/AddSubjectMaterialForm/${EduCompId}/${branchId}`,
      data
    );
  }

  getMaterialById<T>(subjectId: any, materialId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/showSubjectMaterialView/${subjectId}/${materialId}`
    );
  }

  updateMaterialForm(EduCompId: any, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/AddSubjectMaterialForm/${EduCompId}`,
      data
    );
  }

  deleteMaterial(materialId: any) {
    return this.http.delete(
      `${environment.apiURL}Admin/RemoveMaterial/${materialId}`
    );
  }

  publishMaterial(materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/PublishDepublishhMaterial/${materialId}`
    );
  }

  getGroupsByEduCompId<T>(EduCompId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/returnListEduCompIdGroupByEduCompID/${EduCompId}`
    );
  }

  returnSearchedUnitsBySubjectId<T>(subjectId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/returnSearchedUnitsBySubjectId/${subjectId}`
    );
  }

  returnSearchedLessonsByUnitId<T>(UnitId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/returnSearchedLessonsByUnitId/${UnitId}`
    );
  }

  searcheMaterial<T>(data: ISearchMaterialVM) {
    return this.http.get<T>(
      `${`${environment.apiURL}Admin/returnSearchedMaterialViewResult/${data.p}`}/${
        data?.searchedItemId
      }/${data.searchedItemType}/${data.searchedTeacherId}`
    );
  }

  showVideoByMaterialId(materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/showVideoByMaterialId/${materialId}`
    );
  }

  dawnloadLectureAttendees(materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/offlineLectureAttendees/${materialId}`
    );
  }

  getMaterialParts(materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/materialPartsTable/${materialId}`
    );
  }

  getPartById<T>(partId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/getMaterialPartByID/${partId}`
    );
  }

  addPart(data: any) {
    return this.http.post(environment.apiURL + "Admin/AddMaterialPart", data);
  }

  // updatePart(data: any) {
  //   return this.http.post(this.updatePartURL, data);
  // }

  deletePart(partId: any) {
    return this.http.post(
      `${environment.apiURL}Admin/RemoveMaterialPart/${partId}`,
      null
    );
  }

  getMaterialAttaches(materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/materialAttachsTable/${materialId}`
    );
  }

  addAttach(data: any) {
    return this.http.post(environment.apiURL + "Admin/AddMaterialAttach", data);
  }

  deleteAttach(AttachId: any) {
    return this.http.post(
      `${environment.apiURL}Admin/RemoveMaterialAttach/${AttachId}`,
      null
    );
  }

  getExamsAndTemplates(eduCompId: any, subjectId: any, materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/showMaterialQuiz/${eduCompId}/${subjectId}/${materialId}`
    );
  }

  getMaterialQuizes<T>(materialId: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/returnExamsByMaterialId/${materialId}`
    );
  }

  addMaterialQuiz(materialIdHiddenQuiz: any, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/AddQuizForm/${materialIdHiddenQuiz}`,
      data
    );
  }

  deleteMaterialQuiz(Id: any) {
    return this.http.delete(
      `${environment.apiURL}Admin/RemoveMaterialQuiz/${Id}`
    );
  }

  AddPopQuestion(materialId: any, body: any) {
    return this.http.post(
      `${environment.apiURL}Admin/AddPopQuestion/${materialId}`,
      body
    );
  }

  getPopQuestions(materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/returnMaterialPopQuestionsByMaterialId/${materialId}`
    );
  }

  deletePopQuestion(id: any) {
    return this.http.post(
      `${environment.apiURL}Admin/DeleteMaterialPopQuestion/${id}`,
      null
    );
  }

  UploadStudentAttendance(LectureID: any, attendance: any, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/postOfflineLectureAttendees/${attendance}/${LectureID}`,
      data
    );
  }

  offlineLectureAttendeesTable<T>(LectureID: any, page: any) {
    return this.http.get<T>(
      `${environment.apiURL}Admin/offlineLectureAttendeesTable/${LectureID}/${page}`
    );
  }

  AddCustomMaterialPoint(data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/CustomMaterialPoint`,
      data
    );
  }

  getCustomMaterialPoint(page: any, materialId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/returnCustomPointMaterialByMaterialId/${page}/${materialId}`
    );
  }
  DeleteCustomMaterialPoint(pointId: any) {
    return this.http.delete(
      `${environment.apiURL}Admin/deleteCustomPointMaterialByMaterialId/${pointId}`
    );
  }

  searchAttendanceManual(data: any) {
    return this.http.post(
      environment.apiURL + "Admin/offlineLectureAttendees",
      data
    );
  }

  updateAttendanceManual(data: any) {
    return this.http.post(
      environment.apiURL + "Admin/editOfflineLectureAttendeeState",
      data
    );
  }
}
