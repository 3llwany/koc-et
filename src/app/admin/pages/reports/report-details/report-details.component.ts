import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import {
  IReportParameterModel,
  ITeacherDropModel,
  ICenterDropModel,
  IStudentDropModel,
  IReportSearchModel,
  ICenterIdsSearchModel,
} from "app/admin/models/reports/reports";
import { ReportsService } from "app/admin/services/reports/reports.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { teacherByEduCompId } from "app/shared/models/general/general";

@Component({
  selector: "app-report-details",
  templateUrl: "./report-details.component.html",
  styleUrls: ["./report-details.component.css"],
})
export class ReportDetailsComponent implements OnInit {
  myForm!: FormGroup;

  reportId: any;
  reportParamters = {} as IReportParameterModel;
  centers: ICenterDropModel[] = [];
  teachers: ITeacherDropModel[] = [];
  students: IStudentDropModel[] = [];

  obj = {} as IReportSearchModel;
  isSubmitted: boolean = false;
  lecturesExamsViewsCountReportMode: boolean = false;
  studentsFollowUpReportMode: boolean = false;
  manualPaymentsReportMode: boolean = false;
  reservationReportMode: boolean = false;
  financialSummaryReportMode: boolean = false;
  financialDetailedReportMode: boolean = false;

  lecturesSalesReportMode: boolean = false;
  financialReportMode: boolean = false;
  materialCodesReportMode: boolean = false;

  get fromDateCtrl() {
    return this.myForm.get("fromDate");
  }
  get toDateCtrl() {
    return this.myForm.get("toDate");
  }
  get centerIdCtrl() {
    return this.myForm.get("centerId");
  }
  get teacherUserIdCtrl() {
    return this.myForm.get("teacherUserId");
  }
  get studentIdCtrl() {
    return this.myForm.get("studentId");
  }
  get studentNameCtrl() {
    return this.myForm.get("studentName");
  }

  constructor(
    private reportsService: ReportsService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public authserv: AuthService,
    private msg: ToastrService,
    private generalService: GeneralService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((param) => {
      this.reportId = param.get("reportId");
    });

    this.reportsService
      .getReportParameters<IReportParameterModel>(this.reportId)
      .subscribe((response) => {
        if (response) {
          //  console.log("report paramters: ", response);
          this.reportParamters = response;
        }
      });

    this.myForm = this.fb.group({
      fromDate: [null],
      toDate: [null],
      centerId: [null],
      teacherUserId: [null],
      studentId: [null],
      studentName: [null],
    });

    this.returnEduCompByUser();
  }

  onSelectStudent(event) {
    this.studentIdCtrl.setValue(event.option.value);
  }
  returnEduCompByUser() {
    this.generalService.getEduCompByUser().subscribe((res: any) => {
      // console.log("CENTERS: ", res);
      this.centers = res;
    });
  }

  onSelectCenter() {
    let obj = {} as ICenterIdsSearchModel;
    obj.CenterIds = [];
    obj.CenterIds.push(this.centerIdCtrl?.value);

    if (this.reportParamters.IsTeacherParameter) {
      this.reportsService
        .getTeachersByCenters<ICenterIdsSearchModel, ITeacherDropModel[]>(obj)
        .subscribe((response) => {
          if (response) {
            //   console.log("TEACHERS: ", response);
            this.teachers = response;
          }
        });
    }
  }

  onSelectTeacher() {
    this.obj.teacherUserId = this.teacherUserIdCtrl?.value;
  }

  onStudentSearch() {
    let obj = {} as ICenterIdsSearchModel;
    obj.CenterIds = [];
    obj.CenterIds.push(this.centerIdCtrl?.value);
    obj.Search = this.studentNameCtrl?.value;

    // if (!this.studentNameCtrl?.value) {
    //   this.msg.warning("يرجي البحث بإسم او رقم هاتف او البريد الإلكتروني للطالب");
    //   return;
    // }

    if (this.reportParamters.IsStudentParameter) {
      this.reportsService
        .getStudentsByCenters<ICenterIdsSearchModel, IStudentDropModel[]>(obj)
        .subscribe((response) => {
          if (response) {
            //  console.log("STUDENTS: ", response);
            this.students = response;
          }
        });
    }
  }

  onSubmit() {
    if (this.myForm.valid) {
      this.obj.ReportId = this.reportId;
      this.obj.FromDate = this.fromDateCtrl?.value;
      this.obj.ToDate = this.toDateCtrl?.value;
      this.obj.CenterIds = [];
      this.obj.CenterIds.push(this.centerIdCtrl?.value);
      this.obj.teacherUserId = this.teacherUserIdCtrl?.value;
      this.obj.StudentId = this.studentIdCtrl?.value;

      console.log("onSubmit", this.obj);
      //#1) lecturesExamsViewsCountReport
      if (this.reportId == 3) {
        this.lecturesExamsViewsCountReportMode = true;
      } //#2) StudentsFollowUpReport
      else if (this.reportId == 1) {
        if (!this.centerIdCtrl?.value) {
          this.msg.warning("برجاء إختيار المركز");
          return;
        }

        if (!this.studentIdCtrl?.value) {
          this.msg.warning(
            "يرجي اخيار طالب حيث يمكنك عرض الطلاب من خلال بإستخدام زر البحث"
          );
          return;
        }

        this.studentsFollowUpReportMode = true;
      } //#3) ManualPaymentsReport
      else if (this.reportId == 12) {
        this.manualPaymentsReportMode = true;
      } //#4) ReservationReport
      else if (this.reportId == 13) {
        this.reservationReportMode = true;
      } //#5) FinancialSummaryReport
      else if (this.reportId == 16) {
        this.financialSummaryReportMode = true;
      } //#6) FinancialDetailedReport
      else if (this.reportId == 17) {
        this.financialDetailedReportMode = true;
      }
      //#7) LecturesSalesReport
      else if (this.reportId == 4) {
        this.lecturesSalesReportMode = true;
      } //#8) FinancialReport
      else if (this.reportId == 6) {
        this.financialReportMode = true;
      } //#9) MaterialCodesReport
      else if (this.reportId == 10) {
        this.materialCodesReportMode = true;
      }

      this.isSubmitted = true;
    }
  }
  refresh() {
    window.location.reload();
  }
}
