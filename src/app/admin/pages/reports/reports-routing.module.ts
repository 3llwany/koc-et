import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { ReportDetailsComponent } from "./report-details/report-details.component";
import { ReportsIndexComponent } from "./report-index/reports-index.component";

const routes: Routes = [
  { path: "", redirectTo: "index", pathMatch: "full" },
  { path: "index", component: ReportsIndexComponent },
  {
    path: "report-details/:reportId",
    component: ReportDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportsRoutingModule {}
