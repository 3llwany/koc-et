import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import {
  IManualPaymentModel,
  IReportSearchModel,
} from "app/admin/models/reports/reports";
import { ReportsService } from "app/admin/services/reports/reports.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-manual-payments-report",
  templateUrl: "./manual-payments-report.component.html",
  styleUrls: ["./manual-payments-report.component.css"],
})
export class ManualPaymentsReportComponent implements OnInit {
  @Input("reportObj") reportObj: any;

  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private msg: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // console.log("NOW CALL SERVER: ", this.reportObj);

    let obj = {} as IManualPaymentModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.FromDate = (this.reportObj as IReportSearchModel).FromDate;
    obj.ToDate = (this.reportObj as IReportSearchModel).ToDate;

    this.reportsService
      .getManualPaymentReportExcel<IManualPaymentModel, any>(obj)
      .subscribe((response) => {
        if (response) {
          //  console.log("report lectures: ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          this.msg.success("Report has been downloaded successfully");
        }
      });
  }
}
