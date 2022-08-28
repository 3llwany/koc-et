import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  CustomDiscountDropMV,
  IStudentCustomDiscountsMV,
  StudentCustomDiscountsListMV,
} from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-student-discount",
  templateUrl: "./student-discount.component.html",
  styleUrls: ["./student-discount.component.scss"],
})
export class StudentDiscountComponent implements OnInit {
  userId: any;
  functionId: any;
  EduCompId: any;
  myForm!: FormGroup;
  userName: string = " ";
  CustomDiscountList: CustomDiscountDropMV[];
  // StudentCustomDiscountsList: StudentCustomDiscountsListMV[];

  displayedColumns: string[] = ["#", "name", "discount", "teacher", "note"];
  dataSource: MatTableDataSource<StudentCustomDiscountsListMV>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private fb: FormBuilder,
    private reservationServ: ReservationService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private authservice: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.userId = params.get("userId");
    });
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
    });
  }

  ngOnInit(): void {
    this.EduCompId = this.authservice.getEduCompId();
    this.getStudentCustomDiscount();
    this.getCustomDiscount();
    this.getStudentCustomDiscountsList();
    this.myForm = this.fb.group({
      userId: [this.userId, Validators.required],
      customDiscountId: ["", Validators.required],
      note: [""],
    });
  }
  get FormCtrls() {
    return this.myForm.controls;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    this.authservice.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getCustomDiscount();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateStudentCustomDiscount() {
    if (this.myForm.valid) {
      this.spinner.show();
      this.reservationServ
        .updateStudentCustomDiscount(this.myForm.value)
        .subscribe((res: any) => {
          this.getStudentCustomDiscountsList();
          this.toaster.success("تم التغيير");
          this.spinner.hide();
        });
    }
  }

  getStudentCustomDiscount() {
    this.spinner.show();
    this.reservationServ
      .getStudentCustomDiscount<IStudentCustomDiscountsMV>(this.userId)
      .subscribe((res) => {
        //   console.log("getStudentCustomDiscount", res);
        this.userName = res.User.ar_name;
        this.FormCtrls.userId.setValue(res.User.user_ID);
        this.FormCtrls.customDiscountId.setValue(res.Discount?.Id || "");
        this.FormCtrls.note.setValue(res.note);
        this.spinner.hide();
      });
  }

  getStudentCustomDiscountsList() {
    this.spinner.show();
    this.reservationServ
      .getStudentCustomDiscountsList<StudentCustomDiscountsListMV[]>(
        this.userId
      )
      .subscribe((res) => {
        this.dataSource = new MatTableDataSource(res.reverse());
        this.dataSource.paginator = this.paginator;
        console.log(res);
        this.spinner.hide();
      });
  }

  getCustomDiscount() {
    this.reservationServ
      .getCustomDiscount<CustomDiscountDropMV[]>(this.EduCompId)
      .subscribe((res) => {
        this.CustomDiscountList = res;
      });
  }
}
