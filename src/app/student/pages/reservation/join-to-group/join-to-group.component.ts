import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import {
  StudentGroupVM,
  IReservationVM,
} from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { ConfirmReservationDialogComponent } from "../confirm-reservation-dialog/confirm-reservation-dialog.component";

@Component({
  selector: "app-join-to-group",
  templateUrl: "./join-to-group.component.html",
  styleUrls: ["./join-to-group.component.scss"],
})
export class JoinToGroupComponent implements OnInit {
  code: string;
  viewId: number;
  EduCompId: number;
  currentYear: number;
  teacherId: number;

  studyingGroups: StudentGroupVM[] = [];
  Reservations?: IReservationVM;
  myForm: FormGroup;
  submitted: boolean = false;
  showGroups: boolean = false;
  isUserHasBalance: boolean = true;
  reservationCompleted: boolean = true;
  updateURL: string = "";

  constructor(
    private fb: FormBuilder,
    private reservationServ: ReservationService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.route.parent?.paramMap.subscribe((params) => {
      this.code = params.get("code");
      this.viewId = Number(params.get("viewId"));
      this.EduCompId = Number(params.get("EduCompId"));
      this.currentYear = Number(params.get("currentYear"));
      this.teacherId = Number(params.get("teacherId"));

      this.updateURL = `/student/reservation/${this.teacherId}/${this.EduCompId}/${this.viewId}/${this.code}/${this.currentYear}/submit`;
    });
  }

  ngOnInit() {
    this.checkUserBalance();
    this.getAvailableGroups();
    this.getReservationInfo();
    this.myForm = this.fb.group({
      groupId: ["", Validators.required],
      teacherUserId: ["", Validators.required],
      eduCompId: ["", Validators.required],
    });
    this.FormCtrls.teacherUserId.setValue(this.teacherId);
    this.FormCtrls.eduCompId.setValue(this.EduCompId);
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  getAvailableGroups() {
    this.reservationServ
      .getAvailableGroups(this.teacherId, this.EduCompId)
      .subscribe((res: any) => {
        this.studyingGroups = res;
      });
  }

  checkUserBalance() {
    this.reservationServ
      .checkUserBalance(this.EduCompId, this.teacherId)
      .subscribe((res: any) => {
        this.isUserHasBalance = res.balance;
        this.reservationCompleted = res.reservationCompleted;
      });
  }

  getReservationInfo() {
    this.spinner.show();
    this.reservationServ
      .getReservationInfo(this.EduCompId)
      .subscribe((res: any) => {
        //  console.log('getReservationInfo', res);
        if (res) {
          this.Reservations = res;
        }
        this.spinner.hide();
      });
  }

  CompletaReservation() {
    this.submitted = true;
    let valid = this.myForm.valid;
    console.log("Submit", this.myForm.value);

    if (valid) {
      this.spinner.show();
      this.reservationServ
        .CompletaReservation(this.myForm.value)
        .subscribe((res: any) => {
          this.submitted = false;
          if (res.returnValue == 1 && res.returnString == "Success") {
            this.showGroups = false;
            this.toaster.success("تم تأكيد الحجز الحجز ");
            this.openDialog(res.model);
            this.checkUserBalance();
            this.getReservationInfo();
          } else if (
            res.returnString ==
            "Student already exists in a group with the same teacher and subject"
          ) {
            this.toaster.info("انت بالفعل موجود في مجموعة لهذا المدرس");
          } else if (
            res.returnString ==
            "Not enough credits, go to charge balance page to charge"
          ) {
            this.toaster.info(
              "رصيدك غير كافي اذهب الي شحن الرصيد للشحن واكمال عملية التسجيل"
            );
          } else {
            this.toaster.info(res.returnString);
          }
          this.spinner.hide();
          //  console.log('CompletaReservation', res);
        });
    }
  }

  openDialog(studentData): void {
    const dialogRef = this.dialog.open(ConfirmReservationDialogComponent, {
      data: studentData,
      minHeight: "80vh",
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) true;
    });
  }
}
