import { TranslateModule } from "@ngx-translate/core";
import { TranslateService } from "@ngx-translate/core";
import { MaterialModule } from "./../shared/material/material.module";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";

import { RegistrationRoutingModule } from "./registration-routing.module";

import { ErrorPageComponent } from "./error/error-page.component";
import { LoginPageComponent } from "./login/login-page.component";
import { RegisterComponent } from "./register/register.component";
import { EducationalDetailsComponent } from "./educational-details/educational-details.component";
import { ForgotPasswordComponent } from "./forgot-password/forgot-password.component";

@NgModule({
  imports: [
    CommonModule,
    RegistrationRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgxSpinnerModule,
    MaterialModule,
    TranslateModule,
  ],
  declarations: [
    ErrorPageComponent,
    LoginPageComponent,
    RegisterComponent,
    EducationalDetailsComponent,
    ForgotPasswordComponent,
  ],
})
export class RegistrationModule {}
