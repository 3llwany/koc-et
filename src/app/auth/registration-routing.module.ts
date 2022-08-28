import { EducationalDetailsComponent } from "./educational-details/educational-details.component";
import { RegisterComponent } from "./register/register.component";
import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ErrorPageComponent } from "./error/error-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";
import { NotUserGuard } from "app/shared/services/auth/Guards/auth/not-user.guard";
import { IsStudentGuard } from "app/shared/services/auth/Guards/roles/is-student.guard";
import { PendingChangesGuard } from "app/shared/services/auth/Guards/auth/pending-changes.guard";

const routes: Routes = [
  {
    path: "",
    children: [
      {
        path: "error",
        component: ErrorPageComponent,
      },

      {
        path: "login",
        component: LoginPageComponent,
        canActivate: [NotUserGuard],
      },

      {
        path: "register",
        component: RegisterComponent,
        canActivate: [NotUserGuard],
      },
      {
        path: "reset-password",
        component: ForgotPasswordComponent,
        canActivate: [NotUserGuard],
      },

      {
        path: "educational-details",
        component: EducationalDetailsComponent,
        canActivate: [IsStudentGuard],
        canDeactivate: [PendingChangesGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegistrationRoutingModule {}
