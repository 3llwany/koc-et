import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import {
  IGetPaymentsHistoryVM,
  IUserPaymentsHistoryVM,
} from "app/student/models/balance";
import { StudentService } from "app/student/services/student.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-student-payments-history",
  templateUrl: "./student-payments-history.component.html",
  styleUrls: ["./student-payments-history.component.scss"],
})
export class StudentPaymentsHistoryComponent implements OnInit {
  itemsCount: number = 0;
  displayedColumns: string[] = [
    "#",
    "lectureType",
    "lectureName",
    "teacher",
    "subject",
    "paymentMethod",
    "date",
    "amount",
  ];
  dataSource: MatTableDataSource<IUserPaymentsHistoryVM>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private studentserv: StudentService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getPaymentsHistory(1);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  getPaymentsHistory(p: number) {
    this.spinner.show();
    this.studentserv
      .getPaymentsHistory<IGetPaymentsHistoryVM>(p)
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(
          res.userPaymentsHistoryListModified
        );
        this.itemsCount = res.itemsCount;
        this.spinner.hide();
      });
  }
}
