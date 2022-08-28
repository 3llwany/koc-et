import { Component, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { subject } from "app/admin/models/admin/educations";
import { EducationalService } from "app/admin/services/Admin/educational.service";
import { SubjectsService } from "app/admin/services/Admin/subjects.service";
import {
  country,
  IRowFunctionVM,
  stageByCountry,
  YearsByStage,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { ToastrService } from "ngx-toastr";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";

@Component({
  selector: "app-subject-index",
  templateUrl: "./subject-index.component.html",
  styleUrls: ["./subject-index.component.scss"],
})
export class SubjectIndexComponent implements OnInit {
  EduCompId: any;
  branchId: any;
  functionId: number;
  rowFunctions: IRowFunctionVM[];

  subjects: subject[] = [];
  countriesList: country[] = [];
  stagesList: stageByCountry[] = [];
  Years: YearsByStage[] = [];
  myForm!: FormGroup;
  submitted = false;
  totalItems: any;

  displayedColumns: string[] = ["#", "stage", "year", "subject", "actions"];
  dataSource: MatTableDataSource<subject>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private fb: FormBuilder,
    public authserv: AuthService,
    private SubjectsService: SubjectsService,
    private generlServ: GeneralService,
    private eduServ: EducationalService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
      if (this.functionId) {
        this.authserv
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
            }
          });
      }
    });
  }

  ngOnInit(): void {
    this.EduCompId = this.authserv.getEduCompId();
    this.branchId = this.authserv.getBranchId();

    this.myForm = this.fb.group({
      select_Education_Component: [this.EduCompId, Validators.required],
      countryID: [""],
      stageID: [""],
      eduYearID: [""],
      page: [1],
    });

    this.getAllCountriesList();
    this.getSubjects(1);
  }

  get FomCtrls() {
    return this.myForm.controls;
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.FomCtrls?.select_Education_Component.setValue(e.EduCompId);
      this.getSubjects(1);
    });

    this.authserv.branchId.subscribe((e) => {
      this.branchId = e.branchId;
      //this.FomCtrls?.branchId.setValue(e.branchId);
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getSubjects(page: number) {
    if (this.FomCtrls?.select_Education_Component.value == "null") {
      this.toaster.warning("Please Choose Center!");
      return;
    }

    if (this.myForm.valid) {
      this.spinner.show();
      this.FomCtrls.page.setValue(page);
      this.SubjectsService.getSubjects(this.myForm.value).subscribe(
        (res: any) => {
          //this.subjects = res.subjects;
          this.dataSource = new MatTableDataSource(res.subjects);
          this.totalItems = res.TotalItemCount;
          this.spinner.hide();
        }
      );
    }
  }

  openDeleateDialog(subject: subject): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: subject.subject_ar_name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.deleteSubject(subject);
      });
  }

  deleteSubject(subject: subject) {
    this.spinner.show();
    this.SubjectsService.deleteSubject(subject.subject_id).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          let i = this.dataSource.data.indexOf(subject);
          this.dataSource.data.splice(i, 1);
          this.toaster.success("تم الحذف");

          this.spinner.hide();
        }
      }
    );
  }

  getAllCountriesList() {
    this.generlServ.getAllCountriesList<country[]>().subscribe((res) => {
      this.countriesList = res;
    });
  }

  getEducationalStageByCountryID(countryId: any) {
    if (countryId != "") {
      this.eduServ
        .getEducationalStageByCountryID(countryId)
        .subscribe((res: any) => {
          this.stagesList = res.eduYearsList;
        });
    }
  }

  getYearbyStageID(StageId: any) {
    if (StageId != "") {
      this.eduServ.getYearbyStageID(StageId).subscribe((res: any) => {
        this.Years = res.eduYearsList;
      });
    }
  }
}
