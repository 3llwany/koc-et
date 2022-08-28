import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, ViewChild } from "@angular/core";
import { StudentService } from "app/student/services/student.service";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { IGetPaymentsVM, IUserPaymentsVM } from "app/student/models/balance";

@Component({
  selector: "app-student-payments",
  templateUrl: "./student-payments.component.html",
  styleUrls: ["./student-payments.component.scss"],
})
export class StudentPaymentsComponent implements OnInit {
  itemsCount: number = 0;
  displayedColumns: string[] = [
    "#",
    "code",
    "date",
    "amount",
    "center",
    "teacher",
    "paymentMethod",
    "status",
  ];
  dataSource: MatTableDataSource<IUserPaymentsVM>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private studentserv: StudentService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getPayments(1);
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getPayments(p: number) {
    this.spinner.show();
    this.studentserv.getPayments<IGetPaymentsVM>(p).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.userPaymentsHistoryList);
      this.itemsCount = res.itemsCount;
      this.spinner.hide();
    });
  }
}
