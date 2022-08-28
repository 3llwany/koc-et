import { MatDialog } from "@angular/material/dialog";
import { NgxSpinnerService } from "ngx-spinner";
import { FormBuilder, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { SupportService } from "app/support/services/support.service";
import { ISearchStudentVM, IStudentDataVM } from "app/support/models/support";
import { CowpayReferenceComponent } from "../cowpay-reference/cowpay-reference.component";
import { ResetPasswordComponent } from "../reset-password/reset-password.component";

@Component({
  selector: "app-search-student",
  templateUrl: "./search-student.component.html",
  styleUrls: ["./search-student.component.scss"],
})
export class SearchStudentComponent implements OnInit {
  myForm: FormGroup;
  studentData: IStudentDataVM;
  constructor(
    private fb: FormBuilder,
    private SupportService: SupportService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      email: [""],
      mobile: [""],
    });
  }
  get FormCtrls() {
    return this.myForm.controls;
  }

  searchStudent() {
    if (this.FormCtrls.email.value || this.FormCtrls.mobile.value) {
      this.spinner.show();
      this.SupportService.searchStudent<IStudentDataVM, ISearchStudentVM>(
        this.myForm.value
      ).subscribe((res) => {
        console.log(res);
        this.studentData = res;
        this.spinner.hide();
      });
    }
  }

  openCowpayDialog(): void {
    this.dialog
      .open(CowpayReferenceComponent, {
        minWidth: "30vw",
      })
      .afterClosed()
      .subscribe((confirm) => {});
  }

  openResetPasswordDialog(): void {
    this.dialog
      .open(ResetPasswordComponent, { minWidth: "50vw" })
      .afterClosed()
      .subscribe((confirm) => {});
  }
}
