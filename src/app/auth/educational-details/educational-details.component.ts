import {
  EditEduDataVM,
  IStageDropVM,
  IYearDropVM,
} from "./../../shared/models/general/general";
import { CustomeValidator } from "./../../shared/validators/customeValid.validator";
import { Component, HostListener, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { GeneralService } from "app/shared/services/General/general.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ErrorStateMatcher } from "@angular/material/core";
import { StudentService } from "app/student/services/student.service";
import { Observable } from "rxjs";
import { ComponentCanDeactivate } from "app/shared/services/auth/Guards/auth/pending-changes.guard";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-educational-details",
  templateUrl: "./educational-details.component.html",
  styleUrls: ["./educational-details.component.scss"],
})
export class EducationalDetailsComponent
  implements OnInit, ComponentCanDeactivate
{
  @HostListener("window:beforeunload")
  canDeactivate(): Observable<boolean> | boolean {
    if (this.myForm.valid) return true;
    else return false;
  }

  EduStages: IStageDropVM[] = [];
  EduYears: IYearDropVM[] = [];
  stageID: any;

  myForm: FormGroup;
  submitted = false;
  isFailed = false;
  errMsg = "";
  matcher = new ErrorStateMatcher();
  constructor(
    private authService: AuthService,
    private generalServ: GeneralService,
    private studentServ: StudentService,
    private fb: FormBuilder,
    private router: Router,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {}
  ngOnInit(): void {
    this.getEduStagesList();

    this.myForm = this.fb.group({
      stageID: ["", [Validators.required]],
      EduYearID: ["", [Validators.required]],
      parentName: [
        "",
        [
          Validators.required,
          CustomeValidator.whiteSpace,
          Validators.pattern(
            /^[a-zA-Z \u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+$/
          ),
        ],
      ],
      parentPhoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\-\(\)\S*$]*$/),
          Validators.minLength(11),
          Validators.maxLength(11),
        ],
      ],
    });
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  //Return Educational Stages List
  getEduStagesList() {
    this.generalServ.getAllEduStagesList<IStageDropVM[]>().subscribe((res) => {
      this.EduStages = res;
    });
  }

  //Return Educational Years List By Stage Id
  getEduYearByStageId(stageId: any) {
    this.EduYears = [];
    this.FormCtrls.EduYearID.setValue("");
    if (stageId) {
      this.generalServ
        .getEduYearByStageId<IYearDropVM[]>(stageId)
        .subscribe((res) => {
          this.EduYears = res;
        });
    }
  }

  // Save Student Educational Stage Data
  SaveStudenStage() {
    this.submitted = true;
    if (this.myForm.valid) {
      this.spinner.show();
      this.studentServ
        .SaveStudenStage<EditEduDataVM, any>(this.myForm.value)
        .subscribe((res) => {
          this.spinner.hide();
          if (res.returnValue == 1) {
            this.isFailed = false;
            this.toaster.success(
              "تم انشاء الحساب بنجاح، من فضلك قم بتسجيل الدخول "
            );
            this.authService.logout();
            this.router.navigateByUrl("/auth/login");
          } else {
            this.isFailed = true;
            this.errMsg = res.returnString;
          }
        });
    }
  }
}
