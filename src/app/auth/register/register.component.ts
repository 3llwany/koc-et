import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RegisterMV } from "app/shared/models/auth/auth";
import { AuthService } from "app/shared/services/auth/auth.service";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-register",
  templateUrl: "./register.component.html",
  styleUrls: ["./register.component.scss"],
})
export class RegisterComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg = "";
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group(
      {
        Id: [null],
        userTypeId: [2, Validators.required],

        ar_name: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z \u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+$/
            ),
            CustomeValidator.whiteSpace,
          ],
        ],

        mobile: [
          "",
          [
            Validators.required,
            Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_ \-\(\)\S*$]*$/),
            Validators.minLength(11),
            Validators.maxLength(11),
            CustomeValidator.startsWith,
          ],
        ],

        account_email: ["", [Validators.required, Validators.email]],

        account_password: [
          "",
          [Validators.required, CustomeValidator.whiteSpace],
        ],

        confirmPassword: ["", [Validators.required]],
      },
      {
        validator: CustomeValidator.mustMatch(
          "account_password",
          "confirmPassword"
        ),
      }
    );
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.myForm.value);

    if (this.myForm.valid) {
      this.spinner.show();
      this.authService
        .Registeration<RegisterMV, any>(this.myForm.value)
        .subscribe((res) => {
          //console.log(res);
          this.spinner.hide();
          this.submitted = false;
          this.isFailed = false;
          if (res.returnValue == 1) {
            localStorage.setItem("token", res.token.token);
            localStorage.setItem("user_type_Id", res.user_type_id);
            if (res.user_type_id == "2") {
              this.router.navigateByUrl("/auth/educational-details");
            } else {
              this.router.navigateByUrl("/home");
            }
          }

          if (res.returnValue == 0) {
            this.isFailed = true;
            this.errMsg = res.returnString;
          }
        });
    }
  }
}
