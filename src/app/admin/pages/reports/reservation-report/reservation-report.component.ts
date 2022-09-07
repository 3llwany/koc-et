import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, Input } from "@angular/core";

import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import {
  IReportSearchModel,
  IReservationModel,
} from "app/admin/models/reports/reports";
import { ReportsService } from "app/admin/services/reports/reports.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-reservation-report",
  templateUrl: "./reservation-report.component.html",
  styleUrls: ["./reservation-report.component.css"],
})
export class ReservationReportComponent implements OnInit {
  @Input("reportObj") reportObj: any;

  constructor(
    private reportsService: ReportsService,
    private fb: FormBuilder,
    private msg: ToastrService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    //console.log('NOW CALL SERVER YA BEH: ', this.reportObj);
    this.spinner.show();
    let obj = {} as any;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds[0];
    obj.teacherUserId = (this.reportObj as IReportSearchModel).teacherUserId;
    this.reportsService
      .getReservationReportExcel<IReservationModel, any>(obj)
      .subscribe((response) => {
        if (response?.path) {
          // console.log('report lectures: ', response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );

          this.msg.success("Report has been downloaded successfully");
        } else this.msg.warning(response);
        this.spinner.hide();
      });
  }
}
