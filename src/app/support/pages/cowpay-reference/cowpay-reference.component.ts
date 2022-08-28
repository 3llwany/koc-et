import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { SupportService } from "app/support/services/support.service";
import { FormControl, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-cowpay-reference",
  templateUrl: "./cowpay-reference.component.html",
  styleUrls: ["./cowpay-reference.component.scss"],
})
export class CowpayReferenceComponent {
  myForm = new FormGroup({
    cowPayId: new FormControl("", [Validators.required]), //954386862
  });
  Results: string;
  constructor(
    private SupportService: SupportService,
    private spinner: NgxSpinnerService
  ) {}

  CowpayReferenceSearch() {
    this.Results = "";
    if (this.myForm.valid) {
      this.spinner.show();
      this.SupportService.CowpayReferenceSearch(
        this.myForm.controls["cowPayId"].value
      ).subscribe((res: any) => {
        this.Results = res.returnString;
        this.spinner.hide();
      });
    }
  }
}
