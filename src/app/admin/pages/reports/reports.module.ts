import { ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "./../../../shared/material/material.module";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { ReportsRoutingModule } from "./reports-routing.module";
import { FinancialDetailedReportComponent } from "./financial-detailed-report/financial-detailed-report.component";
import { FinancialReportComponent } from "./financial-report/financial-report.component";
import { FinancialSummaryReportComponent } from "./financial-summary-report/financial-summary-report.component";
import { LecturesExamsViewsCountReportComponent } from "./lectures-exams-views-count-report/lectures-exams-views-count-report.component";
import { LecturesSalesReportComponent } from "./lectures-sales-report/lectures-sales-report.component";
import { ManualPaymentsReportComponent } from "./manual-payments-report/manual-payments-report.component";
import { MaterialCodesReportComponent } from "./material-codes-report/material-codes-report.component";
import { ReportDetailsComponent } from "./report-details/report-details.component";
import { ReportsIndexComponent } from "./report-index/reports-index.component";
import { ReservationReportComponent } from "./reservation-report/reservation-report.component";
import { StudentsFollowUpReportComponent } from "./students-follow-up-report/students-follow-up-report.component";
import { SharedModule } from "app/shared/shared.module";

@NgModule({
  declarations: [
    ReportsIndexComponent,
    ReportDetailsComponent,
    LecturesExamsViewsCountReportComponent,
    StudentsFollowUpReportComponent,
    ManualPaymentsReportComponent,
    ReservationReportComponent,
    FinancialSummaryReportComponent,
    FinancialDetailedReportComponent,
    LecturesSalesReportComponent,
    FinancialReportComponent,
    MaterialCodesReportComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    NgxPaginationModule,
    MaterialModule,
  ],
})
export class ReportsModule {}
