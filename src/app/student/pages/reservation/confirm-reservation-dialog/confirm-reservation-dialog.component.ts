import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ReservationService } from "app/admin/services/Admin/reservation.service";

@Component({
  selector: "app-confirm-reservation-dialog",
  templateUrl: "./confirm-reservation-dialog.component.html",
  styleUrls: ["./confirm-reservation-dialog.component.scss"],
})
export class ConfirmReservationDialogComponent implements OnInit {
  studentData: any;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private reservationServ: ReservationService
  ) {
    this.studentData = data;
  }

  ngOnInit(): void {}
}
