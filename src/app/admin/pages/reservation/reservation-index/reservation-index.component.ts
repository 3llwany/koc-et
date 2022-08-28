import { NgxSpinnerModule, NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  Status,
  city,
  StudentGroupVM,
  IReservationVM,
  IGetReservationListVM,
  ISearchReservationVM,
  IAreaVM,
} from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";
import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { ReservationDetailsComponent } from "../reservation-details/reservation-details.component";
import { IRowFunctionVM } from "app/shared/models/general/general";

@Component({
  selector: "app-reservation-index",
  templateUrl: "./reservation-index.component.html",
  styleUrls: ["./reservation-index.component.scss"],
})
export class ReservationIndexComponent implements OnInit {
  EduCompId: any;
  branchId: any;
  functionId: number;
  rowFunctions: IRowFunctionVM[];

  // Branches: CenterBranchesVM[];
  //  Dates: any;
  Status: Status[];
  Cities: city[];
  Areas: IAreaVM[];
  Reservations: IReservationVM[];
  groups: StudentGroupVM[];
  itemsCount: number = 0;

  myForm!: FormGroup;

  displayedColumns: string[] = [
    "#",
    "name",
    "accountName",
    "code",
    "branch",
    "mobile",
    "status",
    "group",
    "discount",
    "date",
    "note",
    "actions",
  ];
  dataSource: MatTableDataSource<IReservationVM>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private fb: FormBuilder,
    private reservationService: ReservationService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private authserv: AuthService,
    private SubjectMaterialsService: SubjectMaterialsService,
    private spinner: NgxSpinnerService,
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
      EduCompId: [this.EduCompId, Validators.required],
      branchId: [],
      email: ["", Validators.email],
      name: [""],
      mobile: [""],
      code: [""],
      groupId: [""],
      statusId: [""],
      cityId: [""],
      currentYear: [1],
      page: [],
    });

    //this.returnBranchesByEduCompId();
    this.getGroupsByEduCompId();
    this.returnStatus();
    this.getArea();
    this.getReservationsList(1);
  }

  get page() {
    return this.myForm.get("page");
  }

  get branchIdCtrl() {
    return this.myForm.get("branchId");
  }

  get EduCompIdCtrl() {
    return this.myForm.get("EduCompId");
  }
  get currentYearCtrl() {
    return this.myForm.get("currentYear");
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.EduCompIdCtrl.setValue(e.EduCompId);
    });

    this.authserv.branchId.subscribe((e) => {
      this.branchId = e.branchId;
      this.branchIdCtrl.setValue(e.branchId);
      this.getReservationsList(1);
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getReservationsList(p) {
    this.page?.setValue(p);

    // if (!this.branchIdCtrl.value || this.branchIdCtrl.value == "null") {
    //   this.toaster.warning("You Must Select Branch");
    //   return;
    // }

    if (!this.EduCompIdCtrl.value || this.EduCompIdCtrl.value == "null") {
      this.toaster.warning("You Must Select Center");
      return;
    }

    if (this.myForm.valid) {
      this.spinner.show();
      this.reservationService
        .getReservationsList<ISearchReservationVM, IGetReservationListVM>(
          this.myForm.value
        )
        .subscribe((res: any) => {
          //console.log("Reservations", res);
          this.Reservations = res.list;
          this.dataSource = new MatTableDataSource(res.list);
          this.itemsCount = res.itemsCount;
          this.spinner.hide();
        });
    }
  }

  getGroupsByEduCompId() {
    this.SubjectMaterialsService.getGroupsByEduCompId<StudentGroupVM[]>(
      this.EduCompId
    ).subscribe((res: any) => {
      if (res.retunValue == 1) {
        this.groups = res.lstEduCompGroups;
      }
    });
  }

  returnStatus() {
    this.reservationService.returnStatus<Status[]>().subscribe((res) => {
      this.Status = res;
    });
  }

  // returnCities() {
  //   this.reservationService.returnCities<city[]>().subscribe((res) => {
  //     this.Cities = res;
  //   });
  // }

  getArea() {
    this.reservationService.getArea<IAreaVM[]>().subscribe((res) => {
      this.Areas = res;
    });
  }

  ReservationDetailsDialog(reservationId: number): void {
    this.dialog
      .open(ReservationDetailsComponent, {
        data: {
          reservationId: reservationId,
        },
        minWidth: "90vw",
      })
      .afterClosed()
      .subscribe();
  }

  Reset() {
    this.myForm.reset();
    this.EduCompIdCtrl.setValue(this.EduCompId);
    this.branchIdCtrl.setValue(this.branchId);
    this.currentYearCtrl.setValue(1);
  }

  // returnBranchesByEduCompId() {
  //   this.reservationService
  //     .returnBranchesByEduCompId<CenterBranchesVM[]>(this.EduCompId)
  //     .subscribe((res: any) => {
  //       this.Branches = res;
  //     });
  // }

  // Return Avaliable Dates By BranchId
  // GetAvaliableDatesByBranchId(branchId: any) {
  //   if (branchId) {
  //     this.reservationServ
  //       .GetAvaliableDatesByBranchId(branchId, true, true)
  //       .subscribe((res: any) => {
  //         this.Dates = res;
  //       });
  //   } else {
  //     this.Dates = [];
  //   }
  // }
}
