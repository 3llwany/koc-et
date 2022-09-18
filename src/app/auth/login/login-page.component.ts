import { ToastrService } from "ngx-toastr";
import { StudentService } from "app/student/services/student.service";
import { Component, OnInit } from "@angular/core";
import { FormGroup, Validators, FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { loginMV } from "app/shared/models/auth/auth";
import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { EditEduDataVM } from "app/shared/models/general/general";

@Component({
  selector: "app-login-page",
  templateUrl: "./login-page.component.html",
  styleUrls: ["./login-page.component.scss"],
})
export class LoginPageComponent implements OnInit {
  submitted = false;
  isFailed = false;
  errMsg = "";
  returnUrl?: any;

  loginForm: FormGroup;

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private authService: AuthService,
    private studentServ: StudentService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams["returnUrl"];
    this.loginForm = this.fb.group({
      mobile: [
        "",
        [
          Validators.required,
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_ \-\(\)\S*$]*$/),
          Validators.minLength(8),
          Validators.maxLength(8),
        ],
      ],
      account_password: ["", [Validators.required]],
    });
  }

  get FormCtrls() {
    return this.loginForm.controls;
  }

  // login
  login() {
    this.submitted = true;
    if (this.loginForm.valid) {
      this.spinner.show();
      this.authService
        .login<loginMV, any>(this.loginForm.value)
        .subscribe((res) => {
          this.spinner.hide();
          this.submitted = false;
          this.isFailed = false;

          if (res.returnValue == 0) {
            localStorage.setItem("token", res.authToken.token);
            localStorage.setItem("user_type_Id", res.authToken.type_Id);
            localStorage.setItem("yearId", res.yearId);
            localStorage.setItem("EduCompList", res.authToken.EduCompList);
            this.authService.setEduCompId(res.authToken.EduCompList[0]);
            //  localStorage.setItem("EduCompId", res.authToken.EduCompList[0]);

            if (res.authToken.type_Id == 2)
              this.router.navigateByUrl(this.returnUrl || "student");
            else if (res.authToken.type_Id == 6)
              this.router.navigateByUrl("/support/search" || "home");
            else this.router.navigateByUrl("/home");
          }

          // if login Error
          else if (res.returnValue == -1) {
            this.isFailed = true;
            this.errMsg = "البريد الإلكتروني او كلمه السر غير صحيحه";
          } else {
            this.isFailed = true;
            this.errMsg = res.returnString;
          }
        });
    }
  }
}
