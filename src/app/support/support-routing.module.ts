import { SearchStudentComponent } from "./pages/search-student/search-student.component";
import { NgModule, Component } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { SearchCodeComponent } from "./pages/search-code/search-code.component";
import { GenerateStudentCodeComponent } from "./pages/generate-student-code/generate-student-code.component";
import { TicketsComponent } from "./pages/tickets/tickets.component";
import { RefundBalanceComponent } from "./pages/refund-balance/refund-balance.component";
import { RefundLectureComponent } from "app/shared/components/refund-lecture/refund-lecture.component";
import { UserBalanceDetailsComponent } from "app/shared/components/user-balance-details/user-balance-details.component";

const routes: Routes = [
  { path: "", redirectTo: "search", pathMatch: "full" },
  { path: "search", component: SearchStudentComponent },
  {
    path: "search-code",
    component: SearchCodeComponent,
  },
  {
    path: "generate-code/:userId",
    component: GenerateStudentCodeComponent,
  },
  {
    path: "tickets/:userId",
    component: TicketsComponent,
  },
  {
    path: "refund-balance/:userId",
    component: RefundBalanceComponent,
  },
  {
    path: "refund-lecture/:userId",
    component: RefundLectureComponent,
  },
  {
    path: "balance-details/:userId",
    component: UserBalanceDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SupportRoutingModule {}
