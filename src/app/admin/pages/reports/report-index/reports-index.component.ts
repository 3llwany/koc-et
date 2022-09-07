import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IReportIndexViewModel } from "app/admin/models/reports/reports";
import { ReportsService } from "app/admin/services/reports/reports.service";

@Component({
  selector: "app-reports-index",
  templateUrl: "./reports-index.component.html",
  styleUrls: ["./reports-index.component.css"],
})
export class ReportsIndexComponent implements OnInit {
  reports: IReportIndexViewModel[] = [];

  constructor(
    private reportsService: ReportsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.reportsService
      .getAllReportsIndex<IReportIndexViewModel[]>()
      .subscribe((response) => {
        if (response) {
          //  console.log("reports: ", response);
          this.reports = response;
        }
      });
  }

  onClick(report: IReportIndexViewModel) {
    this.router.navigateByUrl("/dashboard/report-details/" + report.ReportId);
  }
}
