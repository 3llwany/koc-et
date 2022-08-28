import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { GenerateCodesService } from "../../../services/Admin/generate-codes.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { teacherBySubEduComp } from "app/admin/models/admin/educations";
import { NgxSpinnerService } from "ngx-spinner";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { environment } from "environments/environment";
import { ToastrService } from "ngx-toastr";
import { IGenerateBalanceCodesVM } from "app/admin/models/admin/admin";

@Component({
  selector: "app-generate-balance-codes",
  templateUrl: "./generate-balance-codes.component.html",
  styleUrls: ["./generate-balance-codes.component.scss"],
})
export class GenerateBalanceCodesComponent implements OnInit {
  EduCompId: number;
  branchId: number;
  Teachers: teacherBySubEduComp[];
  myForm!: FormGroup;
  submitted = false;
  constructor(
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private generateCodesService: GenerateCodesService,
    private authService: AuthService,
    private toastr: ToastrService,
    private GeneralService: GeneralService
  ) {}

  ngOnInit(): void {
    this.EduCompId = Number(this.authService.getEduCompId());
    this.branchId = Number(this.authService.getEduCompId());
    this.getTeachersByEducompId(this.EduCompId);
    this.myForm = this.fb.group({
      teacherId: ["", Validators.required],
      EduCompId: [this.EduCompId, Validators.required],
      Amount: ["", [Validators.required, CustomeValidator.bigZero]],
      Price: ["", [Validators.required, CustomeValidator.bigZero]],
    });
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  ngAfterViewInit() {
    this.authService.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
    });

    this.authService.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });
  }

  GenerateBalanceCodes() {
    this.submitted = true;
    this.FormCtrls.EduCompId.setValue(this.EduCompId);
    let data: IGenerateBalanceCodesVM = {
      Amount: this.FormCtrls.Amount.value,
      Price: this.FormCtrls.Price.value,
      teacherId: this.FormCtrls.teacherId.value,
      EduCompId: this.EduCompId,
    };
    if (this.myForm.valid) {
      this.spinner.show();
      this.generateCodesService
        .GenerateBalanceCodes<IGenerateBalanceCodesVM>(data)
        .subscribe((res: any) => {
          //  console.log("GenerateBalanceCodes", res);
          this.submitted = false;
          if (res.returnValue == 1) {
            window.open(
              environment.apiURL.replace("/api/", "") + res.path,
              "_blank"
            );
            this.myForm.reset();
          } else this.toastr.error(res.returnString, "Codes Not Generated !");
          this.spinner.hide();
        });
    }
  }

  getTeachersByEducompId(EduCompId: any) {
    if (EduCompId) {
      this.GeneralService.getTeachersByEducompId(EduCompId).subscribe(
        (res: any) => {
          this.Teachers = res.lstTeachers;
        }
      );
    }
  }
}
