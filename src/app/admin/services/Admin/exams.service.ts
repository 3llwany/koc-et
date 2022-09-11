import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class ExamsService {
  constructor(private http: HttpClient) {}

  getTeachersByEducompId(EduCompId: any) {
    return this.http.get(
      `${environment.apiURL}Admin/QuestionsBank/${EduCompId}`
    );
  }

  getQuestions(page: any, EduCompId: any, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/QuestionsBankTable/${page}/${EduCompId}`,
      data
    );
  }

  getQuestionByID(id: any) {
    return this.http.get(`${environment.apiURL}Admin/get-question-bank/${id}`);
  }

  addEditQuestion(eduCompID: any, data: any) {
    return this.http.post(
      `${environment.apiURL}Admin/question-bank-add-edit/${eduCompID}`,
      data
    );
  }

  updateQuestion(Id: any, data: any) {
    return this.http.put(
      `${environment.apiURL}Admin/QuestionsBank/${Id}`,
      data
    );
  }

  deleteQuestion(eduCompID: any, id: any) {
    return this.http.post(
      `${environment.apiURL}Admin/removeQuestionBank/${eduCompID}/${id}`,
      null
    );
  }

  getSubjectsByTeacherId(teacherId: any) {
    return this.http.post(
      `${environment.apiURL}Admin/get-lectures-by-teacher-query`,
      teacherId
    );
  }

  getAllNormalExams<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "exam/returnRecentlyAddedExams",
      obj
    );
  }

  publishExam<TV>(examId: number) {
    return this.http.get<TV>(
      `${environment.apiURL}exam/publish-depublish-exam/${examId}`
    );
  }

  deleteExam<TV>(id: number) {
    return this.http.delete<TV>(`${environment.apiURL}Admin/RemoveExam/${id}`);
  }

  getAllCountries<T>() {
    return this.http.get<T>(environment.apiURL + "country/return-countries");
  }

  getAllStages<T>(countryId: number) {
    return this.http.get<T>(
      `${environment.apiURL}stage/return-stages/${countryId}`
    );
  }

  getAllEducationYears<T>(stageId: number) {
    return this.http.get<T>(
      `${environment.apiURL}year/return-years/${stageId}`
    );
  }

  getAllSubjects<T>(educationYearId: number) {
    return this.http.get<T>(
      `${environment.apiURL}subject/return-subjects/${educationYearId}`
    );
  }

  getAllTeachersBySublectId<T>(subjectId: number) {
    return this.http.get<T>(
      `${environment.apiURL}teacher/return-teachers/${subjectId}`
    );
  }

  getAllUnitsBySublectId<T>(subjectId: number) {
    return this.http.get<T>(
      `${environment.apiURL}unit/return-units/${subjectId}`
    );
  }

  getAllLessonsByUnitId<T>(unitId: number) {
    return this.http.get<T>(
      `${environment.apiURL}lesson/return-lesson/${unitId}`
    );
  }

  getAllExamType<T>() {
    return this.http.get<T>(environment.apiURL + "exam/return-exam-types");
  }

  getExamById<T>(id: number) {
    return this.http.get<T>(`${environment.apiURL}exam/get-exam-by-id/${id}`);
  }

  getExamDetailsById<T>(examId: number) {
    return this.http.get<T>(`${environment.apiURL}Exam/Details/${examId}`);
  }

  addExam<T, TY>(data: T) {
    return this.http.post<TY>(environment.apiURL + "exam/add-exam", data);
  }

  getAllQuestionGroups<T>() {
    return this.http.get<T[]>(
      environment.apiURL + "exam/return-question-groups"
    );
  }

  getAllQuestionHeaders<T>() {
    return this.http.get<T[]>(
      environment.apiURL + "exam/return-question-heads"
    );
  }

  addExamGroupHeader<T, TY>(data: T) {
    return this.http.post<TY>(
      `${environment.apiURL}exam/add-question-group-head`,
      data
    );
  }

  editExamGroupHeader<T, TY>(data: T) {
    return this.http.post<TY>(
      environment.apiURL + "exam/EditQuestionHead",
      data
    );
  }

  deleteExamGroupHeader(id: number) {
    return this.http.get(
      `${environment.apiURL}exam/delete-exam-head-by-id/${id}`
    );
  }

  getAllGroupHeaderByExamId<T>(id: number) {
    return this.http.get<T[]>(
      `${environment.apiURL}exam/GetQuestionHeadGroupByExamId/${id}`
    );
  }

  getAllQuestionsByHeadId<T>(id: number) {
    return this.http.get<T>(
      `${environment.apiURL}exam/GetExamQuestionsByQuestionHead/${id}`
    );
  }

  addQuestion<T>(data: any) {
    return this.http.post<T>(
      environment.apiURL + "exam/add-exam-questions",
      data
    );
  }

  getQuestionForEditByID<T>(id: number) {
    return this.http.get<T>(
      `${environment.apiURL}exam/return-question-details/${id}`
    );
  }

  editQuestion<T>(data: any) {
    return this.http.post<T>(
      environment.apiURL + "exam/edit-exam-questions",
      data
    );
  }

  deleteExamQuestion<T>(id: number) {
    return this.http.delete<T>(
      `${environment.apiURL}exam/RemoveExamQuestion/${id}`
    );
  }

  getExamPoints(examId: any, page: any) {
    return this.http.get(
      `${environment.apiURL}exam/returnCustomPointExamByExamId/${examId}/${page}`
    );
  }

  addExamPoint(body: any) {
    return this.http.post(environment.apiURL + "exam/CustomExamPoint", body);
  }

  deleteExamPoint(pointId: any) {
    return this.http.delete(
      `${environment.apiURL}exam/DeleteCustomExamPoint/${pointId}`
    );
  }

  UploadExamStudentGrades(data: any) {
    let URL = environment.apiURL + "Exam/postStudentsGrades";
    return this.http.post(URL, data);
  }

  getQuestionByCorrectionType(page: any, correctionStatus: any) {
    return this.http.get(
      `${environment.apiURL}Exam/CorrectionIndexPaging/${page}/${correctionStatus}`
    );
  }

  submitCorrection(body: any) {
    return this.http.post(
      `${environment.apiURL}/Exam/submitQuestionCorrection`,
      body
    );
  }
}
