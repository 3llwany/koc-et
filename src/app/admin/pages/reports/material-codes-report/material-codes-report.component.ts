import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import {
  ILectureCodesModel,
  IReportSearchModel,
} from "app/admin/models/reports/reports";
import { ReportsService } from "app/admin/services/reports/reports.service";
import { environment } from "environments/environment";

@Component({
  selector: "app-material-codes-report",
  templateUrl: "./material-codes-report.component.html",
  styleUrls: ["./material-codes-report.component.css"],
})
export class MaterialCodesReportComponent implements OnInit {
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

    let obj = {} as ILectureCodesModel;
    obj.CenterIds = (this.reportObj as IReportSearchModel).CenterIds;
    obj.TeacherId = (this.reportObj as IReportSearchModel).teacherUserId;

    this.reportsService
      .getMaterialCodesReportExcel<ILectureCodesModel, any>(obj)
      .subscribe((response) => {
        if (response) {
          // console.log("report lectures: ", response);
          window.open(
            environment.apiURL.replace("/api/", "") + response.path,
            "_blank"
          );
          this.msg.success("Report has been downloaded successfully");
        }
      });
  }
}
