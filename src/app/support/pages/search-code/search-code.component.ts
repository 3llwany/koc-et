import { ToastrService } from "ngx-toastr";
import { GenerateCodesService } from "./../../../admin/services/Admin/generate-codes.service";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { ICodeDetailsVM } from "app/shared/models/general/general";

@Component({
  selector: "app-search-code",
  templateUrl: "./search-code.component.html",
  styleUrls: ["./search-code.component.scss"],
})
export class SearchCodeComponent implements OnInit {
  myForm: FormGroup;
  CodeDetails: ICodeDetailsVM;
  constructor(
    private fb: FormBuilder,
    private GenerateCodesService: GenerateCodesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      code: [null],
      counter: [null],
    });
  }

  get CodeCtrl() {
    return this.myForm.controls["code"];
  }
  get CounterCtrl() {
    return this.myForm.controls["counter"];
  }

  searchCodes() {
    this.CodeDetails = null;
    if (this.CodeCtrl.value || this.CounterCtrl.value) {
      this.spinner.show();
      this.GenerateCodesService.searchCodes<ICodeDetailsVM>(
        this.CodeCtrl?.value || "null",
        this.CounterCtrl.value || "null"
      ).subscribe((res) => {
        this.CodeDetails = res;
        if (res == null) this.toastr.info("Code not found");
      });
      this.spinner.hide();
    } else this.toastr.warning("Please Enter Code or Serial ");
  }
}
