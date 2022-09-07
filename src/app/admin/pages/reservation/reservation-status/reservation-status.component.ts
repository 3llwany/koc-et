import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  Status,
  StudentStatusListVM,
  StudentGroupVM,
  StatusReasons,
  CenterBranchesVM,
} from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-reservation-status",
  templateUrl: "./reservation-status.component.html",
  styleUrls: ["./reservation-status.component.scss"],
})
export class ReservationStatusComponent implements OnInit {
  reservationId: number;
  EduCompId: any;
  branchId: any;
  functionId: any;
  myForm: FormGroup;
  submitted: boolean = false;
  AcceptReservation: any;
  userName: string = "";
  itemsCount: any;
  statuses: Status[];
  studyingGroups: StudentGroupVM[];
  Reasons: StatusReasons[];
  CenterBranches: CenterBranchesVM[];

  get FormCtrls() {
    return this.myForm.controls;
  }

  get Id() {
    return this.myForm.get("EduCompUser_Status.Id");
  }

  get statusId() {
    return this.myForm.get("EduCompUser_Status.statusId");
  }

  get groupId() {
    return this.myForm.get("EduCompUser_Status.groupId");
  }

  get note() {
    return this.myForm.get("EduCompUser_Status.note");
  }

  get EduCompUserId() {
    return this.myForm.get("EduCompUser_Status.EduCompUserId");
  }

  get statusReasonId() {
    return this.myForm.get("EduCompUser_Status.statusReasonId");
  }

  get CenterBranchId() {
    return this.myForm.get("EduCompUser_Status.CenterBranchId");
  }

  displayedColumns: string[] = [
    "#",
    "name",
    "code",
    "status",
    "reason",
    "group",
    "from",
    "to",
    "note",
  ];
  dataSource: MatTableDataSource<StudentStatusListVM>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private reservationServ: ReservationService,
    private toaster: ToastrService,
    private authservice: AuthService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.reservationId = Number(params.get("reservationId"));
    });
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
    });
  }

  ngOnInit(): void {
    this.EduCompId = this.authservice.getEduCompId();
    this.branchId = this.authservice.getBranchId();
    this.getStudentStatus(this.reservationId, this.EduCompId);
    this.returnBranchesByEduCompId();

    this.myForm = this.fb.group({
      EduCompUser_Status: this.fb.group({
        Id: ["", Validators.required],
        statusId: ["", Validators.required],
        groupId: [""],
        note: [""],
        EduCompUserId: [""],
        statusReasonId: [""],
        CenterBranchId: [""],
      }),
      studentUserId: ["", Validators.required],
      Code: [""],
      reserveId: [""],
      EduCompId: [""],
      AcceptReservation: [""],
    });

    this.FormCtrls.AcceptReservation?.setValue(this.AcceptReservation);
    this.FormCtrls.EduCompId?.setValue(this.EduCompId);
  }

  ngAfterViewInit() {
    this.authservice.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getStudentStatus(this.reservationId, e.EduCompId);
      this.EduCompUserId.setValue(e.EduCompId);
    });

    this.authservice.branchId.subscribe((e) => {
      this.branchId = e.branchId;
      this.CenterBranchId.setValue(e.branchId);
    });

    this.dataSource.paginator! = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getStudentStatus(reservationId: any, EduCompId: any) {
    this.spinner.show();
    this.reservationServ
      .GetStudentStatus(reservationId, EduCompId)
      .subscribe((res: any) => {
        // console.log('GetStudentStatus', res);
        this.statuses = res.statuses;
        this.studyingGroups = res.studyingGroups;
        this.myForm.patchValue(res);
        this.FormCtrls.studentUserId.setValue(res.studentUserId);
        this.userName = res.userName;
        this.getReasonsByStatusId(res.EduCompUser_Status.statusId);
        this.ReservationStatusPaging(1);
        this.FormCtrls.AcceptReservation?.setValue(this.AcceptReservation);
        this.spinner.hide();
      });
  }

  SubmitReservationStatus(event: any) {
    this.CenterBranchId.setValue(this.branchId);

    if (!this.CenterBranchId?.value) {
      this.toaster.warning("يجب اختيار فرع");
      return;
    }
    if (this.myForm.valid) {
      event.target.disabled = true;
      this.spinner.show();
      this.reservationServ
        .SubmitReservationStatus(this.myForm.value)
        .subscribe((res: any) => {
          event.target.disabled = false;
          if (res.returnValue == 200 && res.returnString == "Success") {
            this.toaster.success("تم حفظ التغيرات بنجاح");
            this.ReservationStatusPaging(1);
            this.getStudentStatus(this.reservationId, this.EduCompId); //retrieving the latest EduCompUserStatus Id
          } else {
            this.toaster.error(res.returnString, res.returnValue);
          }
          this.spinner.hide();
        });
    }
  }

  ReservationStatusPaging(page: any) {
    this.spinner.show();
    this.reservationServ
      .ReservationStatusPaging(page, this.EduCompUserId?.value)
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res.list);
        this.itemsCount = res.itemsCount;
        this.spinner.hide();
      });
  }

  getReasonsByStatusId(StatusId: any) {
    this.Reasons = [];
    this.statusReasonId?.setValue("");
    if (StatusId) {
      this.reservationServ
        .getReasonsByStatusId<StatusReasons[]>(StatusId)
        .subscribe((res) => {
          this.Reasons = res;
        });
    }
  }

  returnBranchesByEduCompId() {
    this.CenterBranches = [];
    this.reservationServ
      .returnBranchesByEduCompId<CenterBranchesVM[]>(this.EduCompId)
      .subscribe((res) => {
        this.CenterBranches = res;
      });
  }
}
