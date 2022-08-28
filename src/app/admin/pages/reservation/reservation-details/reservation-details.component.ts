import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { IReservationVM } from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";

@Component({
  selector: "app-reservation-details",
  templateUrl: "./reservation-details.component.html",
  styleUrls: ["./reservation-details.component.scss"],
})
export class ReservationDetailsComponent implements OnInit {
  reservation: IReservationVM;

  constructor(
    private reservationService: ReservationService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    const reservationId = data.reservationId;
    this.reservationService
      .ReservationDetails(reservationId)
      .subscribe((res: any) => {
        this.reservation = res;
      });
  }

  ngOnInit(): void {}
}
