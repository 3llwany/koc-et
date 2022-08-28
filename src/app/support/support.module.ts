import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SupportRoutingModule } from "./support-routing.module";
import { SearchStudentComponent } from "./pages/search-student/search-student.component";
import { MaterialModule } from "app/shared/material/material.module";
import { CowpayReferenceComponent } from "./pages/cowpay-reference/cowpay-reference.component";
import {
  NgbAlert,
  NgbAlertConfig,
  NgbAlertModule,
} from "@ng-bootstrap/ng-bootstrap";
import { ResetPasswordComponent } from "./pages/reset-password/reset-password.component";
import { SearchCodeComponent } from "./pages/search-code/search-code.component";
import { GenerateStudentCodeComponent } from "./pages/generate-student-code/generate-student-code.component";
import { TicketsComponent } from "./pages/tickets/tickets.component";
import { SharedModule } from "app/shared/shared.module";
import { RefundBalanceComponent } from './pages/refund-balance/refund-balance.component';

@NgModule({
  declarations: [
    SearchStudentComponent,
    CowpayReferenceComponent,
    ResetPasswordComponent,
    SearchCodeComponent,
    GenerateStudentCodeComponent,
    TicketsComponent,
    RefundBalanceComponent,
  ],
  imports: [
    CommonModule,
    SupportRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    NgxSpinnerModule,
    NgbAlertModule,
    SharedModule,
  ],
})
export class SupportModule {}
