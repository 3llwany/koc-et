import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { CustomeValidator } from "./../../shared/validators/customeValid.validator";
import { AuthService } from "app/shared/services/auth/auth.service";

@Component({
  selector: "app-forgot-password",
  templateUrl: "./forgot-password.component.html",
  styleUrls: ["./forgot-password.component.scss"],
})
export class ForgotPasswordComponent implements OnInit {
  resetForm: FormGroup;
  newPassForm: FormGroup;
  submitted = false;
  isFailed: boolean = false;
  errMsg = "";
  ifHaveCode: boolean = false;

  constructor(
    private authServ: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.resetForm = this.fb.group({
      email: ["", [Validators.required, Validators.email]],
    });

    this.newPassForm = this.fb.group({
      verificationCode: [
        "",
        [Validators.required, CustomeValidator.whiteSpace],
      ],

      new_password: ["", [Validators.required, CustomeValidator.whiteSpace]],
    });
  }

  get email() {
    return this.resetForm.controls["email"];
  }

  get newPassCtrls() {
    return this.newPassForm.controls;
  }

  // START Forgot Password
  forgotPassword() {
    if (this.resetForm.valid) {
      this.spinner.show();
      this.authServ
        .forgotPassword(this.resetForm.value)
        .subscribe((res: any) => {
          console.log(res);
          if (res.returnValue == 0) {
            this.ifHaveCode = true;
            this.isFailed = false;
            this.errMsg = "تم إرسال كود التأكيد الي البريد الإلكتروني الخاص بك";
          } else {
            this.ifHaveCode = false;
            this.isFailed = true;
            this.errMsg = res.returnString;
          }

          this.spinner.hide();
        });
    }
  }

  // START Forgot Password
  resetPassword() {
    this.isFailed = false;
    if (this.newPassCtrls.valid) {
      this.spinner.show();
      this.authServ
        .resetPassword(this.newPassCtrls.value)
        .subscribe((res: any) => {
          console.log(res);
          if (
            res.returnValue == -1 &&
            res.returnString == "Verification code is invalid."
          ) {
            this.isFailed = true;
            this.errMsg = res.returnString;
          } else if (
            res.returnValue == 0 &&
            res.returnString == "Password changed successfully."
          ) {
            this.router.navigateByUrl("auth/login");
            this.toastr.success(
              " تم تغير كلمة المرور بنجاح قم بتسجيل الدخول بكلمة المرور الجديدة"
            );
          }
          this.spinner.hide();
        });
    }
  }
}
