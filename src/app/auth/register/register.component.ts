import { StudentService } from "app/student/services/student.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RegisterMV } from "app/shared/models/auth/auth";
import { EditEduDataVM } from "app/shared/models/general/general";
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
    private authService: AuthService,
    private studentServ: StudentService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group(
      {
        Id: [null],
        userTypeId: [2, Validators.required],

        ar_name: [""],

        mobile: [
          "",
          [
            Validators.required,
            Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_ \-\(\)\S*$]*$/),
            Validators.minLength(8),
            Validators.maxLength(8),
          ],
        ],

        account_email: [""],

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

    if (this.myForm.valid) {
      this.spinner.show();
      this.authService
        .Registeration<RegisterMV, any>(this.myForm.value)
        .subscribe((res) => {
          //console.log(res);
          this.spinner.hide();
          this.submitted = false;
          this.isFailed = false;
          if (res.returnValue === 1) {
            localStorage.setItem("token", res?.token?.token);
            localStorage.setItem("user_type_Id", res?.user_type_id);
            if (res.user_type_id === 2) {
              //  this.router.navigateByUrl("/auth/educational-details");
              this.SaveStudenStage();
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

  SaveStudenStage() {
    let data: EditEduDataVM = {
      stageID: 1004,
      EduYearID: 1002,
      parentName: "parent",
      parentPhoneNumber: this.FormCtrls.mobile.value,
    };
    this.spinner.show();
    this.studentServ
      .SaveStudenStage<EditEduDataVM, any>(data)
      .subscribe((res) => {
        this.spinner.hide();
        if (res.returnValue == 1) {
          this.isFailed = false;
          localStorage.setItem("yearId", String(data.EduYearID));

          //this.authService.logout();
          //this.router.navigateByUrl("/auth/login");
          this.router.navigateByUrl("student");
        } else {
          this.isFailed = true;
          this.errMsg = res.returnString;
        }
      });
  }
}
