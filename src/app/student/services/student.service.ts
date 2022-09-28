import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class StudentService {
  constructor(private http: HttpClient) {}

  //#region  Student Profile

  //Return Student Subjects
  returnStudentSubjects<T>() {
    return this.http.get<T>(environment.apiURL + "AJAX/subjectsIndex");
  }

  //Return Student Subject Evaluation
  returnSubjectEvaluation<T>(id: any) {
    return this.http.get<T>(
      environment.apiURL + "AJAX/subjectEvaluation/" + id
    );
  }

  getSubjectMaterials<T>(subjectId: number) {
    return this.http.get<T>(
      environment.apiURL +
        "AJAX/returnSubcribedAndUnSubcribedLectures/" +
        subjectId
    );
  }

  //Return Student General Evaluation
  returnGeneralEvaluation<T>() {
    return this.http.get<T>(environment.apiURL + "Dashboard/Evaluation");
  }

  //Educational Component Request
  EduCompRequest(data: any) {
    return this.http.post(
      environment.apiURL + "AJAX/EduComponentRequest/",
      data
    );
  }

  //Refund Lecture
  refundLecture(lecId: any) {
    return this.http.get(environment.apiURL + "AJAX/refundLecture/" + lecId);
  }

  //balanceCheck
  balanceCheck<T>() {
    return this.http.get<T>(environment.apiURL + "AJAX/balanceCheck");
  }

  //returnUserPaymentsHistory
  getPaymentsHistory<T>(id: any) {
    return this.http.get<T>(
      environment.apiURL + "AJAX/returnUserPaymentsHistory/" + id
    );
  }

  //returnUserPayments
  getPayments<T>(id: any) {
    return this.http.get<T>(
      environment.apiURL + "AJAX/returnUserPayments/" + id
    );
  }

  //Request Fawry Code
  payAmount(amount: any, teacherId: any, EduCompId?: any, methodId?: any) {
    return this.http.post(
      `${environment.apiURL}AJAX/PayAmount/${amount}/${teacherId}/${EduCompId}/${methodId}`,
      null
    );
  }

  payAmountForDirectPay(amount: any, teacherId: any) {
    return this.http.post(
      `${environment.apiURL}AJAX/PayAmount/${amount}/${teacherId}`,
      null
    );
  }

  //Request Fawry Code For Tamer ElQady
  payAmountCowPay(amount: any, teacherId: any, EduCompId: any) {
    return this.http.post(
      environment.apiURL +
        `AJAX/payAmountCowPay/${amount}/${teacherId}/${EduCompId}`,
      null
    );
  }

  //pay Amount  By Credit
  payAmountCredit(data: any) {
    return this.http.post(environment.apiURL + "AJAX/PayAmountCC", data);
  }

  //Student  Education Stage Data
  SaveStudenStage<T, TE>(data: T) {
    return this.http.post<TE>(
      environment.apiURL + "AJAX/registerStudent",
      data
    );
  }

  //return Student Education Stage Data
  getStudenStageData<T>() {
    return this.http.get<T>(environment.apiURL + "AJAX/getStudentData");
  }

  //Student  Education Stage Data
  TestFile(data: any) {
    return this.http.post(environment.apiURL + "AJAX/TestFile", data);
  }
  //#endregion

  //#region  Student Exams
  ////////////////////////////////

  //return Student Exams
  returnStudentExam(examId: any) {
    return this.http.get(environment.apiURL + "Exam/Details/" + examId);
  }

  //return Student Education Stage Data
  returnStudentExamResults(examId: any) {
    return this.http.post(environment.apiURL + "Exam/Results/" + examId, null);
  }

  //Submit Single Question
  SubmitSingleQuestion(data: any) {
    return this.http.post(
      `${environment.apiURL}Exam/SubmitSingleQuestion`,
      data
    );
  }

  //Submit Exam
  SubmitExam(data: any) {
    return this.http.post(environment.apiURL + "Exam/Submit", data);
  }

  //Generate Exam From Template By templateId
  GenerateExamFromTemplate(templateId: any) {
    return this.http.post(
      environment.apiURL + "Exam/GenerateExamFromTemplate/" + templateId,
      null
    );
  }
  //#endregion

  //#region Student Reservation
  ////////////////////////////////////

  // Return Inputs
  returnInputsByViewEduCompId(EduCompId: any, viewId: any) {
    return this.http.post(
      environment.apiURL +
        `AJAX/returnInputsByViewEduCompId/${EduCompId}/${viewId}`,
      null
    );
  }

  // Return Policies
  EducationalComponentPolicies(viewId: any, code: any) {
    return this.http.get(
      environment.apiURL + `AJAX/EducationalComponentPolicies/${viewId}/${code}`
    );
  }

  // Reservation
  SubmitReservation(data: any) {
    return this.http.post(environment.apiURL + "AJAX/Reservation", data);
  }

  // Return Educational Component Branches
  EducationalComponentTimetable(viewId: any, code: any) {
    return this.http.get(
      environment.apiURL +
        `AJAX/EducationalComponentTimetable/${viewId}/${code}`
    );
  }

  // Return Avaliable Dates By BranchId
  GetAvaliableDatesByBranchId(
    BranchId: any,
    MustHaveStudents: boolean,
    DontShowMaxed: boolean
  ) {
    return this.http.get(
      environment.apiURL +
        `AJAX/GetAvaliableDatesByBranchId/${BranchId}/${MustHaveStudents}/${DontShowMaxed}`
    );
  }

  // Submit Date to Branche
  SubmitEducationalComponentTimetable(data: any) {
    return this.http.post(
      environment.apiURL + "AJAX/EducationalComponentTimetable",
      data
    );
  }

  // return Current Student Educational Component Time Table
  returnCurrentStudentEducationalComponentTimeTable(EduCompId: any) {
    return this.http.get(
      `${environment.apiURL}AJAX/returnCurrentStudentEducationalComponentTimeTable/${EduCompId}`
    );
  }
  //#endregion

  //#region  Top Students
  //GetTopStudents
  GetTopStudents<T>(EduCompId: any, TeacherId: any, SubjectId: any) {
    return this.http.get<T>(
      `${environment.apiURL}AJAX/GetTopStudents/${EduCompId}/${TeacherId}/${SubjectId}`
    );
  }

  //Get Top Exam Students By Teacher EduCompId
  GetTopExamStudents<T>(EduCompId: any, TeacherId: any) {
    return this.http.get<T>(
      `${environment.apiURL}AJAX/GetTopExamStudentsByTeacherEduCompId/${EduCompId}/${TeacherId}`
    );
  }
  //#endregion
}
