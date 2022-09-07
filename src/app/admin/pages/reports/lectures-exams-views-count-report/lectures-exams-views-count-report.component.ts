import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  ILecturesExamsViewsCountLecturesDetailsModel,
  ILecturesExamsViewsCountExamsDetailsModel,
  ILecturesExamsViewsCountCenterLecturesDetailsModel,
  ILecturesExamsViewsCountLiveLecturesDetailsModel,
  ILecturesExamsViewsCountModel,
  IReportSearchModel,
  IResultReportModel,
} from "app/admin/models/reports/reports";
import { ReportsService } from "app/admin/services/reports/reports.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-lectures-exams-views-count-report",
  templateUrl: "./lectures-exams-views-count-report.component.html",
  styleUrls: ["./lectures-exams-views-count-report.component.css"],
})
export class LecturesExamsViewsCountReportComponent implements OnInit {
  myForm!: FormGroup;
  @Input("reportObj") reportObj: any;

  pLec: number = 1;
  maxSizeLec = 5;
  totalItemsLec: any;
  reportLectureDetails: ILecturesExamsViewsCountLecturesDetailsModel[] = [];

  pEx: number = 1;
  maxSizeEx = 5;
  totalItemsEx: any;
  reportExamsDetails: ILecturesExamsViewsCountExamsDetailsModel[] = [];

  pCeLec: number = 1;
  maxSizeCeLec = 5;
  totalItemsCeLec: any;
  reportCenterLectureDetails: ILecturesExamsViewsCountCenterLecturesDetailsModel[] =
    [];

  pLiLec: number = 1;
  maxSizeLiLec = 5;
  totalItemsLiLec: any;
  reportLiveLectureDetails: ILecturesExamsViewsCountLiveLecturesDetailsModel[] =
    [];

  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private msg: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    console.log("NOW CALL SERVER YA BEH: ", this.reportObj);

    this.getreportLectureDetails(1);
    this.getreportExamsDetails(1);
    this.getreportCenterLectureDetails(1);
    this.getreportLiveLectureDetails(1);
  }

  getreportLectureDetails(pageNumber: number) {
    this.spinner.show();
    this.pLec = pageNumber;

    let obj = {} as ILecturesExamsViewsCountModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.teacherUserId = (this.reportObj as IReportSearchModel).teacherUserId;
    obj.Page = pageNumber;

    this.reportsService
      .lecturesExamsViewsCountLectureReport<
        ILecturesExamsViewsCountModel,
        IResultReportModel<ILecturesExamsViewsCountLecturesDetailsModel[]>
      >(obj)
      .subscribe((response) => {
        if (response) {
          // console.log("report lectures: ", response);
          this.reportLectureDetails = response.data;
          this.totalItemsLec = response.totalItems;
        }
        this.spinner.hide();
      });
  }

  trackLecture(index: number, el: any): number {
    return el.MaterialName;
  }

  onDownLoadLectureAbsence(obj: ILecturesExamsViewsCountLecturesDetailsModel) {
    this.spinner.show();
    let typeId = 6;

    this.reportsService
      .getStudentAbsenceReportExcel(obj.MaterialId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          //  console.log("onDownLoadLectureAbsence ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
        }
        this.spinner.hide();
      });
  }

  onDownLoadLecturePresent(obj: ILecturesExamsViewsCountLecturesDetailsModel) {
    this.spinner.show();
    let typeId = 6;

    this.reportsService
      .getStudentPresentReportExcel(obj.MaterialId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          //  console.log("onDownLoadLecturePresent ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          //window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }

  onDownLoadLectureGuests(obj: ILecturesExamsViewsCountLecturesDetailsModel) {
    this.spinner.show();
    let typeId = 6;

    this.reportsService
      .getGuestStudentPresentReportExcel(obj.MaterialId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          // console.log("onDownLoadLectureGuests ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          //   window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }

  getreportExamsDetails(pageNumber: number) {
    this.pEx = pageNumber;
    this.spinner.show();
    let obj = {} as ILecturesExamsViewsCountModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.teacherUserId = (this.reportObj as IReportSearchModel).teacherUserId;
    obj.Page = pageNumber;

    this.reportsService
      .lecturesExamsViewsCountExamReport<
        ILecturesExamsViewsCountModel,
        IResultReportModel<ILecturesExamsViewsCountExamsDetailsModel[]>
      >(obj)
      .subscribe((response) => {
        if (response) {
          console.log("getreportExamsDetails ", response);
          this.reportExamsDetails = response.data;
          this.totalItemsEx = response.totalItems;
        }
        this.spinner.hide();
      });
  }

  trackExam(index: number, el: any): number {
    return el.MaterialName;
  }

  onDownLoadExamAbsence(obj: ILecturesExamsViewsCountExamsDetailsModel) {
    let typeId = 11;
    this.spinner.show();
    this.reportsService
      .getStudentAbsenceReportExcel(obj.MaterialId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          // console.log("onDownLoadExamAbsence ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          //  window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }

  onDownLoadExamPresent(obj: ILecturesExamsViewsCountExamsDetailsModel) {
    let typeId = 11;
    this.spinner.show();
    this.reportsService
      .getStudentPresentReportExcel(obj.MaterialId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          //     console.log("onDownLoadExamPresent ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          //   window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }

  onDownLoadExamGuests(obj: ILecturesExamsViewsCountExamsDetailsModel) {
    let typeId = 11;
    this.spinner.show();
    this.reportsService
      .getGuestStudentPresentReportExcel(obj.MaterialId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          // console.log("onDownLoadExamGuests ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          //   window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }

  getreportCenterLectureDetails(pageNumber: number) {
    this.pCeLec = pageNumber;
    this.spinner.show();
    let obj = {} as ILecturesExamsViewsCountModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.teacherUserId = (this.reportObj as IReportSearchModel).teacherUserId;
    obj.Page = pageNumber;

    this.reportsService
      .lecturesExamsViewsCountCenterLectureReport<
        ILecturesExamsViewsCountModel,
        IResultReportModel<ILecturesExamsViewsCountCenterLecturesDetailsModel[]>
      >(obj)
      .subscribe((response) => {
        if (response) {
          console.log("report center lectures: ", response);
          this.reportCenterLectureDetails = response.data;
          this.totalItemsCeLec = response.totalItems;
        }
        this.spinner.hide();
      });
  }
  trackCenterLecture(index: number, el: any): number {
    return el.LectureName;
  }

  onDownLoadCenterLectureAbsence(
    obj: ILecturesExamsViewsCountCenterLecturesDetailsModel
  ) {
    this.spinner.show();
    let typeId = 20;

    this.reportsService
      .getStudentAbsenceReportExcel(obj.LectureId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          // console.log("onDownLoadCenterLectureAbsence: ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          //window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }

  onDownLoadCenterLecturePresent(
    obj: ILecturesExamsViewsCountCenterLecturesDetailsModel
  ) {
    this.spinner.show();
    let typeId = 20;

    this.reportsService
      .getStudentPresentReportExcel(obj.LectureId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          // console.log("onDownLoadCenterLecturePresent: ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          //  window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }

  getreportLiveLectureDetails(pageNumber: number) {
    this.spinner.show();
    this.pLiLec = pageNumber;

    let obj = {} as ILecturesExamsViewsCountModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.teacherUserId = (this.reportObj as IReportSearchModel).teacherUserId;
    obj.Page = pageNumber;

    this.reportsService
      .lecturesExamsViewsCountLiveLectureReport<
        ILecturesExamsViewsCountModel,
        IResultReportModel<ILecturesExamsViewsCountLiveLecturesDetailsModel[]>
      >(obj)
      .subscribe((response) => {
        if (response) {
          console.log("report live lectures: ", response);
          this.reportLiveLectureDetails = response.data;
          this.totalItemsLiLec = response.totalItems;
        }
        this.spinner.hide();
      });
  }

  trackLiveEcture(index: number, el: any): number {
    return el.LectureName;
  }

  onDownLoadLiveLectureAbsence(
    obj: ILecturesExamsViewsCountLiveLecturesDetailsModel
  ) {
    this.spinner.show();
    let typeId = 4;

    this.reportsService
      .getStudentAbsenceReportExcel(obj.MaterialId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          //  console.log("onDownLoadLiveLectureAbsence: ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          // window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }

  onDownLoadLiveLecturePresent(
    obj: ILecturesExamsViewsCountLiveLecturesDetailsModel
  ) {
    this.spinner.show();
    let typeId = 4;

    this.reportsService
      .getStudentPresentReportExcel(obj.MaterialId, obj.EduCompId, typeId)
      .subscribe((response: any) => {
        if (response) {
          //  console.log("onDownLoadLiveLecturePresent: ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          // window.open(response as any, "_blank")?.focus();
        }
        this.spinner.hide();
      });
  }
}
