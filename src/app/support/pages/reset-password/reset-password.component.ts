import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  IPostResetPasswordVM,
  IResetPasswordVM,
} from "app/support/models/support";
import { SupportService } from "app/support/services/support.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-reset-password",
  templateUrl: "./reset-password.component.html",
  styleUrls: ["./reset-password.component.scss"],
})
export class ResetPasswordComponent implements OnInit {
  myForm: FormGroup;
  Results: IResetPasswordVM;
  constructor(
    private fb: FormBuilder,
    private SupportService: SupportService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      account_email: [""],
      mobile: [""],
    });
  }
  get FormCtrls() {
    return this.myForm.controls;
  }

  resetPassword() {
    if (this.FormCtrls.account_email.value || this.FormCtrls.mobile.value) {
      this.spinner.show();
      this.SupportService.resetPassword<IPostResetPasswordVM, IResetPasswordVM>(
        this.myForm.value
      ).subscribe((res) => {
        this.Results = res;
        this.spinner.hide();
      });
    }
  }
}
