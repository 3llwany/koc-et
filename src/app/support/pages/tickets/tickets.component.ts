import { ActivatedRoute } from "@angular/router";
import { SupportService } from "./../../services/support.service";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import {
  IGetCaseVM,
  ICaseTypeVM,
  ICaseStatusVM,
  ICaseSourceVM,
  ICaseVM,
  ICaseTableVM,
} from "app/support/models/support";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-tickets",
  templateUrl: "./tickets.component.html",
  styleUrls: ["./tickets.component.scss"],
})
export class TicketsComponent implements OnInit {
  myForm: FormGroup;
  userId: number;
  userName: string = "";
  cases: ICaseTableVM[];
  caseType: ICaseTypeVM[];
  caseStatus: ICaseStatusVM[];
  caseSource: ICaseSourceVM[];

  displayedColumns: string[] = [
    "#",
    "name",
    "contact",
    "type",
    "source",
    "status",
    "date",
    "details",
    "comment",
    "option",
  ];
  dataSource: MatTableDataSource<ICaseTableVM>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private SupportService: SupportService,
    private spinner: NgxSpinnerService
  ) {
    route.paramMap.subscribe((params) => {
      this.userId = Number(params.get("userId"));
      this.getCase(null);
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      CASE_USER_ID: ["", [Validators.required]],
      Case_ID: [null],
      CASE_TYPE_ID: ["", [Validators.required]],
      CASE_STATUS_ID: ["", [Validators.required]],
      CASE_source_ID: ["", [Validators.required]],
      CASE_Date: ["", [Validators.required]],
      CASE_Contact: ["", [Validators.required]],
      CASE_Details: [""],
      CASE_Comment: [""],
    });
    this.FormCtrls.CASE_USER_ID.setValue(this.userId);
    this.getCaseTable();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  getCase(Case_ID: number) {
    if (this.userId) {
      this.spinner.show();
      this.SupportService.getCase<IGetCaseVM>(this.userId, Case_ID).subscribe(
        (res) => {
          //console.log("getCase", res);
          this.caseType = res.caseType;
          this.caseStatus = res.caseStatus;
          this.caseSource = res.caseSource;
          this.userName = res.userName;
          this.spinner.hide();
        }
      );
    }
  }

  getCaseTable() {
    if (this.userId) {
      this.spinner.show();
      this.SupportService.getCaseTable<ICaseTableVM[]>(this.userId).subscribe(
        (res) => {
          //  console.log("getCaseTable", res);
          this.cases = res;
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.spinner.hide();
        }
      );
    }
  }

  AddEditCase() {
    if (this.myForm.valid) {
      this.spinner.show();
      this.SupportService.AddEditCase<ICaseVM>(this.myForm.value).subscribe(
        (res) => {
          //  console.log("add", res);
          this.myForm.reset();
          this.getCaseTable();
          this.spinner.hide();
        }
      );
    }
  }

  getCaseById(caseId: any) {
    let CurrentCase: any = this.cases.find((e) => e.Case_ID == caseId);
    this.myForm.patchValue(CurrentCase);
  }
}
