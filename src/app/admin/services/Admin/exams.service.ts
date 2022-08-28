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

  //#endregion

  getAllExamsURL = environment.apiURL + "exam/returnRecentlyAddedExams";
  getAllNormalExams<T, TV>(obj: T) {
    //console.log("EXAM API: ", environment.apiURL + 'exam/return-all/' + pageNumber + '/' + educationCompanyId);
    //return this.http.get<T>(environment.apiURL + 'exam/return-all/' + pageNumber + '/' + educationCompanyId);
    return this.http.post<TV>(this.getAllExamsURL, obj);
  }

  publishExamURL = environment.apiURL + "exam/publish-depublish-exam/";
  publishExam<TV>(examId: number) {
    return this.http.get<TV>(this.publishExamURL + examId);
  }

  deleteExamURL = environment.apiURL + "Admin/RemoveExam/";
  deleteExam<TV>(id: number) {
    return this.http.delete<TV>(this.deleteExamURL + id);
  }

  getAllCountriesURL = environment.apiURL + "country/return-countries";
  getAllCountries<T>() {
    return this.http.get<T>(this.getAllCountriesURL);
  }

  getAllStagesURL = environment.apiURL + "stage/return-stages/";
  getAllStages<T>(countryId: number) {
    return this.http.get<T>(this.getAllStagesURL + countryId);
  }

  getAllEducationYearsURL = environment.apiURL + "year/return-years/";
  getAllEducationYears<T>(stageId: number) {
    return this.http.get<T>(this.getAllEducationYearsURL + stageId);
  }

  getAllSubjectsURL = environment.apiURL + "subject/return-subjects/";
  getAllSubjects<T>(educationYearId: number) {
    return this.http.get<T>(this.getAllSubjectsURL + educationYearId);
  }

  getAllTeachersBySublectIdURL =
    environment.apiURL + "teacher/return-teachers/";
  getAllTeachersBySublectId<T>(subjectId: number) {
    return this.http.get<T>(this.getAllTeachersBySublectIdURL + subjectId);
  }

  getAllUnitsBySublectIdURL = environment.apiURL + "unit/return-units/";
  getAllUnitsBySublectId<T>(subjectId: number) {
    return this.http.get<T>(this.getAllUnitsBySublectIdURL + subjectId);
  }

  getAllLessonsByUnitIdURL = environment.apiURL + "lesson/return-lesson/";
  getAllLessonsByUnitId<T>(unitId: number) {
    return this.http.get<T>(this.getAllLessonsByUnitIdURL + unitId);
  }

  getAllExamTypeURL = environment.apiURL + "exam/return-exam-types";
  getAllExamType<T>() {
    return this.http.get<T>(this.getAllExamTypeURL);
  }

  getExamByIdURL = environment.apiURL + "exam/get-exam-by-id/";
  getExamById<T>(id: number) {
    return this.http.get<T>(
      this.getExamByIdURL + id // get exam by id
    );
  }

  getExamDetailsByIdURL = environment.apiURL + "Exam/Details/";
  getExamDetailsById<T>(examId: number) {
    return this.http.get<T>(
      this.getExamDetailsByIdURL + examId // get exam details by id
    );
  }

  addExamURL = environment.apiURL + "exam/add-exam";
  addExam<T, TY>(data: T) {
    console.log("Exam",this.addExamURL);
    return this.http.post<TY>(this.addExamURL, data);
  }

  getAllQuestionGroupsURL = environment.apiURL + "exam/return-question-groups";
  getAllQuestionGroups<T>() {
    return this.http.get<T[]>(this.getAllQuestionGroupsURL);
  }

  getAllQuestionHeadersURL = environment.apiURL + "exam/return-question-heads";
  getAllQuestionHeaders<T>() {
    return this.http.get<T[]>(this.getAllQuestionHeadersURL);
  }

  addExamGroupHeaderURL = environment.apiURL + "exam/add-question-group-head";
  addExamGroupHeader<T, TY>(data: T) {
    console.log("link",this.addExamGroupHeaderURL);
    return this.http.post<TY>(this.addExamGroupHeaderURL, data);
  }

  editExamGroupHeaderURL = environment.apiURL + "exam/EditQuestionHead";
  editExamGroupHeader<T, TY>(data: T) {
    return this.http.post<TY>(this.editExamGroupHeaderURL, data);
  }

  deleteExamGroupHeaderURL =
    environment.apiURL + "exam/delete-exam-head-by-id/";
  deleteExamGroupHeader(id: number) {
    return this.http.get(this.deleteExamGroupHeaderURL + id);
  }

  getAllGroupHeaderByExamIdURL =
    environment.apiURL + "exam/GetQuestionHeadGroupByExamId/";
  getAllGroupHeaderByExamId<T>(id: number) {
    return this.http.get<T[]>(this.getAllGroupHeaderByExamIdURL + id);
  }

  getAllQuestionsByHeadIdURL =
    environment.apiURL + "exam/GetExamQuestionsByQuestionHead/";
  getAllQuestionsByHeadId<T>(id: number) {
    return this.http.get<T>(this.getAllQuestionsByHeadIdURL + id);
  }

  addQuestionURL = environment.apiURL + "exam/add-exam-questions";
  addQuestion<T>(data: any) {
    return this.http.post<T>(this.addQuestionURL, data);
  }

  getQuestionForEditByIDURL =
    environment.apiURL + "exam/return-question-details/";
  getQuestionForEditByID<T>(id: number) {
    return this.http.get<T>(this.getQuestionForEditByIDURL + id);
  }

  editQuestionURL = environment.apiURL + "exam/edit-exam-questions";
  editQuestion<T>(data: any) {
    return this.http.post<T>(this.editQuestionURL, data);
  }

  deleteExamQuestionURL = environment.apiURL + "exam/RemoveExamQuestion/";
  deleteExamQuestion<T>(id: number) {
    return this.http.delete<T>(this.deleteExamQuestionURL + id);
  }

  // Exam Points

  getExamPointURL = environment.apiURL + "exam/returnCustomPointExamByExamId/";

  addExamPointURL = environment.apiURL + "exam/CustomExamPoint";
  deleteExamPointURL = environment.apiURL + "exam/DeleteCustomExamPoint/";

  getExamPoints(examId: any, page: any) {
    return this.http.get(this.getExamPointURL + examId + "/" + page);
  }

  addExamPoint(body: any) {
    return this.http.post(this.addExamPointURL, body);
  }

  deleteExamPoint(pointId: any) {
    return this.http.delete(this.deleteExamPointURL + pointId);
  }

  UploadExamStudentGrades(data: any) {
    let URL = environment.apiURL + "Exam/postStudentsGrades";
    return this.http.post(URL, data);
  }
}
