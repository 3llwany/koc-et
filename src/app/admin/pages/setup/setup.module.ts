import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { SetupRoutingModule } from "./setup-routing.module";
import { ManageViewsComponent } from "./manage-views/manage-views.component";
import { GenerateBalanceCodesComponent } from "./generate-balance-codes/generate-balance-codes.component";
import { ManualCashPaymentComponent } from "./manual-cash-payment/manual-cash-payment.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "app/shared/material/material.module";
import { SharedModule } from "app/shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { SendWhatsappMsgComponent } from './send-whatsapp-msg/send-whatsapp-msg.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { ExceptionalViewsComponent } from './exceptional-views/exceptional-views.component';
import { QuestionStudentsSettingsComponent } from "./question-student-settings/question-student-settings.component"; 

@NgModule({
  declarations: [
    GenerateBalanceCodesComponent,
    ManualCashPaymentComponent,
    ManageViewsComponent,
    SendWhatsappMsgComponent,
    ExceptionalViewsComponent,
    QuestionStudentsSettingsComponent,
  ],
  imports: [
    CommonModule,
    SetupRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    NgbModule,
    NgxSpinnerModule,
    NgxPaginationModule
  ],
})
export class SetupModule {}
