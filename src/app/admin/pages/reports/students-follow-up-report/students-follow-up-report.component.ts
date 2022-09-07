import { Component, OnInit, Input, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  IExamStudentReportModel,
  IMaterialStudentReportModel,
  IStudentsFollowUpModel,
  IReportSearchModel,
  IResultReportModel,
} from "app/admin/models/reports/reports";
import { ReportsService } from "app/admin/services/reports/reports.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-students-follow-up-report",
  templateUrl: "./students-follow-up-report.component.html",
  styleUrls: ["./students-follow-up-report.component.css"],
})
export class StudentsFollowUpReportComponent implements OnInit {
  @Input("reportObj") reportObj: any;

  studentName!: string;

  pEx: number = 1;
  maxSizeEx = 5;
  totalItemsEx: any;
  reportExamStudentDetails: IExamStudentReportModel[] = [];

  pMat: number = 1;
  maxSizeMat = 5;
  totalItemsMat: any;
  reportMaterialStudentDetails: IMaterialStudentReportModel[] = [];

  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private msg: ToastrService
  ) {}

  ngOnInit(): void {
    console.log("NOW CALL SERVER YA BEH: ", this.reportObj);

    let obj = {} as IStudentsFollowUpModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.StudentId = (this.reportObj as IReportSearchModel).StudentId;

    console.log("obj From Report", obj);
    this.reportsService
      .examStudentNameReport<IStudentsFollowUpModel, string>(obj)
      .subscribe(
        (response) => {
          if (response) {
            console.log("report student name: ", response);
            this.studentName = (response as any).StudentName;
          }
        },
        (error) => {
          console.log("ERROR: ", error);
        }
      );

    this.getReportExamStudentDetails(1);
    this.getReportMaterialStudentDetails(1);
  }

  getReportExamStudentDetails(pageNumber: number) {
    this.pEx = pageNumber;

    let obj = {} as IStudentsFollowUpModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.StudentId = (this.reportObj as IReportSearchModel).StudentId;
    obj.Page = pageNumber;

    this.reportsService
      .examStudentReport<
        IStudentsFollowUpModel,
        IResultReportModel<IExamStudentReportModel[]>
      >(obj)
      .subscribe(
        (response) => {
          if (response) {
            console.log("report exam: ", response);
            this.reportExamStudentDetails = response.data;
            this.totalItemsEx = response.totalItems;
          }
        },
        (error) => {
          console.log("ERROR: ", error);
        }
      );
  }
  trackExam(index: number, el: any): number {
    return el.MaterialName;
  }

  getReportMaterialStudentDetails(pageNumber: number) {
    this.pMat = pageNumber;

    let obj = {} as IStudentsFollowUpModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.StudentId = (this.reportObj as IReportSearchModel).StudentId;
    obj.Page = pageNumber;

    this.reportsService
      .materialStudenReport<
        IStudentsFollowUpModel,
        IResultReportModel<IMaterialStudentReportModel[]>
      >(obj)
      .subscribe(
        (response) => {
          if (response) {
            console.log("report material: ", response);
            this.reportMaterialStudentDetails = response.data;
            this.totalItemsMat = response.totalItems;
          }
        },
        (error) => {
          console.log("ERROR: ", error);
        }
      );
  }
  trackMaterial(index: number, el: any): number {
    return el.MaterialName;
  }
}
