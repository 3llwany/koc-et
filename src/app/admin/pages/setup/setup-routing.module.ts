import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsAdminGuard } from "app/shared/services/auth/Guards/roles/is-admin.guard";
import { ManualCashPaymentComponent } from "./manual-cash-payment/manual-cash-payment.component";
import { GenerateBalanceCodesComponent } from "./generate-balance-codes/generate-balance-codes.component";
import { ManageViewsComponent } from "./manage-views/manage-views.component";
import { SendWhatsappMsgComponent } from "./send-whatsapp-msg/send-whatsapp-msg.component";
import { ExceptionalViewsComponent } from "./exceptional-views/exceptional-views.component";

const routes: Routes = [
  {
    path: "manual-cash-payment",
    component: ManualCashPaymentComponent,
  },

  {
    path: "generate-balance-codes",
    component: GenerateBalanceCodesComponent,
  },
  {
    path: "manage-views",
    component: ManageViewsComponent,
  },
  {
    path: "send-whatsapp-msg",
    component: SendWhatsappMsgComponent,
  },
  {
    path: "exceptional-views",
    component: ExceptionalViewsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SetupRoutingModule {}
