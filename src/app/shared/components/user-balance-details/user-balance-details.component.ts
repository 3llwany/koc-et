import { AuthService } from "./../../services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, QueryList, ViewChild } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { SearchStudentsService } from "app/admin/services/Admin/searchStudents.service";
import {
  IGetUserPaymentsHistoryVM,
  IGetUserPaymentsVM,
  IuserBalance,
  IUserPaymentsHistoryVM,
  IUserPaymentsVM,
} from "app/student/models/balance";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";

@Component({
  selector: "app-user-balance-details",
  templateUrl: "./user-balance-details.component.html",
  styleUrls: ["./user-balance-details.component.scss"],
})
export class UserBalanceDetailsComponent implements OnInit {
  userBalance: IuserBalance;
  userId: number;
  EduCompId: any = null;
  //Payments: IUserPaymentsVM[] = [];
  // PaymentsHistory: IUserPaymentsHistoryVM[] = [];

  displayedColumnsPayments: string[] = [
    "#",
    "date",
    "amount",
    "paymentMethod",
    "status",
  ];
  displayedColumnsPaymentsHistory: string[] = [
    "#",
    "lectureType",
    "lectureName",
    "teacher",
    "subject",
    "price",
    "paymentMethod",
    "date",
  ];
  dataSourcePayments: MatTableDataSource<IUserPaymentsVM>;
  dataSourcePaymentsHistory: MatTableDataSource<IUserPaymentsHistoryVM>;
  @ViewChild(MatPaginator) paginator = new QueryList<MatPaginator>();
  @ViewChild(MatSort) sort = new QueryList<MatSort>();
  //Pagination
  PaymentsTotalCount: number = 0;
  HistoryTotalCount: number = 0;

  constructor(
    private route: ActivatedRoute,
    private SearchStudentsService: SearchStudentsService,
    private spinner: NgxSpinnerService,
    private authserv: AuthService,
    private toastr: ToastrService
  ) {
    route.paramMap.subscribe((params) => {
      this.userId = Number(params.get("userId"));
    });
  }

  ngOnInit(): void {
    this.EduCompId = this.authserv.getEduCompId();
    this.getStudentBalance();
    this.getStudentPayments(1);
    this.getStudentPaymentsHistory(1);
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getStudentBalance();
      this.getStudentPayments(1);
      this.getStudentPaymentsHistory(1);
    });

    this.authserv.branchId.subscribe((e) => {});
  }

  getStudentBalance() {
    this.spinner.show();
    this.SearchStudentsService.getStudentBalance(
      this.userId,
      this.EduCompId
    ).subscribe((res: any) => {
      this.userBalance = res.model;
      this.spinner.hide();
    });
  }

  getStudentPayments(p: number) {
    this.spinner.show();
    this.SearchStudentsService.getStudentPayments<IGetUserPaymentsVM>(
      this.EduCompId,
      p,
      this.userId
    ).subscribe((res) => {
      this.dataSourcePayments = new MatTableDataSource(res.userPayments);
      this.dataSourcePayments.paginator = this.paginator[0];
      this.dataSourcePayments.sort = this.sort[0];
      this.PaymentsTotalCount = res.totalCount;
      this.spinner.hide();
    });
  }

  getStudentPaymentsHistory(p: number) {
    this.spinner.show();
    this.SearchStudentsService.getStudentPaymentsHistory<IGetUserPaymentsHistoryVM>(
      this.EduCompId,
      p,
      this.userId
    ).subscribe((res) => {
      this.dataSourcePaymentsHistory = new MatTableDataSource(res.userPayments);
      this.dataSourcePaymentsHistory.paginator = this.paginator[1];
      this.dataSourcePaymentsHistory.sort = this.sort[1];
      this.HistoryTotalCount = res.totalCount;
      this.spinner.hide();
    });
  }
}
