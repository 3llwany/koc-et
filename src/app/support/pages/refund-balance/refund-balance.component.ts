import { ToastrService } from "ngx-toastr";
import { CustomeValidator } from "./../../../shared/validators/customeValid.validator";
import { SupportService } from "app/support/services/support.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import {
  IEduCompVM,
  IUserVM,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import {
  IPostRefundBalanceVM,
  IRefundBalanceVM,
} from "app/support/models/support";
import { GeneralService } from "app/shared/services/General/general.service";

@Component({
  selector: "app-refund-balance",
  templateUrl: "./refund-balance.component.html",
  styleUrls: ["./refund-balance.component.scss"],
})
export class RefundBalanceComponent implements OnInit {
  myForm: FormGroup;
  userId: number;
  Balance: number = 0;
  submitted: boolean = false;
  Teachers: teacherByEduCompId[];
  EduComps: IEduCompVM[];
  user: IUserVM;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private SupportService: SupportService,
    private GeneralService: GeneralService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    route.paramMap.subscribe((params) => {
      this.userId = Number(params.get("userId"));
      this.getRefundBalanceData();
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      withdraw: ["", [Validators.required, CustomeValidator.bigZero]],
      teacherUserId: ["", [Validators.required]],
      EduCompId: ["", [Validators.required]],
      user: this.fb.group({
        user_ID: ["", [Validators.required]],
      }),
    });
    this.userIdCtrl.setValue(this.userId);
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  get userIdCtrl() {
    return this.myForm.get("user.user_ID");
  }

  getRefundBalanceData() {
    if (this.userId) {
      this.spinner.show();
      this.SupportService.getRefundBalanceData<IRefundBalanceVM>(
        this.userId
      ).subscribe((res) => {
        this.EduComps = res.EduComps;
        this.user = res.user;
        this.spinner.hide();
      });
    }
  }

  //Get Teachers By EduCompID
  getTeachersByEducompId(EduCompId: any) {
    this.Teachers = [];
    this.FormCtrls.teacherUserId.setValue("");
    if (EduCompId) {
      this.GeneralService.getTeachersByEducompId(EduCompId).subscribe(
        (res: any) => {
          this.Teachers = res.lstTeachers;
        }
      );
    }
  }

  getStudentBalanceForTeacher() {
    this.SupportService.getStudentBalanceForTeacher(
      this.userId,
      this.FormCtrls.teacherUserId.value,
      this.FormCtrls.EduCompId.value
    ).subscribe((res: any) => {
      this.Balance = res.Credits;
    });
  }

  RefundBalance() {
    this.submitted = true;
    if (this.myForm.valid) {
      this.spinner.show();
      this.SupportService.RefundBalance<IPostRefundBalanceVM>(
        this.myForm.value
      ).subscribe((res: any) => {
        if (res.returnString == "Success") {
          this.toastr.success("تم الخصم");
          this.getStudentBalanceForTeacher();
        } else this.toastr.warning(res.returnString);
        this.spinner.hide();
        this.submitted = false;
      });
    }
  }
}
