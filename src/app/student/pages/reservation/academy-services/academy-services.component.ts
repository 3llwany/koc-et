import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { IStudentReservationVM } from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-academy-services",
  templateUrl: "./academy-services.component.html",
  styleUrls: ["./academy-services.component.scss"],
})
export class AcademyServicesComponent implements OnInit {
  isReaded: boolean = false;
  constructor(
    private router: Router,
    private ReservationService: ReservationService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getReservationInfo();
  }

  getReservationInfo() {
    this.spinner.show();
    this.ReservationService.getReservationInfo<IStudentReservationVM>(
      2
    ).subscribe((res) => {
      if (res != null) {
        this.router.navigateByUrl(
          "/student/reservation/22/2/1/48HFR6/1/confirm-reservation"
        );
      }
      this.spinner.hide();
    });
  }
}
