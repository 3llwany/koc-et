import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import {
  IFinancialModel,
  IReportSearchModel,
} from "app/admin/models/reports/reports";
import { ReportsService } from "app/admin/services/reports/reports.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-lectures-sales-report",
  templateUrl: "./lectures-sales-report.component.html",
  styleUrls: ["./lectures-sales-report.component.css"],
})
export class LecturesSalesReportComponent implements OnInit {
  @Input("reportObj") reportObj: any;

  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private msg: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // console.log("NOW CALL SERVER YA BEH: ", this.reportObj);

    let obj = {} as IFinancialModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.teacherUserId = (this.reportObj as IReportSearchModel).teacherUserId;
    obj.FromDate = (this.reportObj as IReportSearchModel).FromDate;
    obj.ToDate = (this.reportObj as IReportSearchModel).ToDate;

    this.reportsService
      .getLecturesSalesReportExcel<IFinancialModel, any>(obj)
      .subscribe((response) => {
        if (response) {
          console.log("report lectures: ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          this.msg.success("Report has been downloaded successfully");
        }
      });
  }
}
