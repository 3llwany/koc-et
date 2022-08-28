import { CustomeValidator } from "./../../../../shared/validators/customeValid.validator";
import { NgxSpinnerService } from "ngx-spinner";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { StudentService } from "app/student/services/student.service";
import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import { ToastrService } from "ngx-toastr";
import { IUserBalanceVM } from "app/student/models/balance";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { IPaymentsTeachersVM } from "app/student/models/student";
import { GenerateCodesService } from "app/admin/services/Admin/generate-codes.service";

@Component({
  selector: "app-balance-recharge",
  templateUrl: "./balance-recharge.component.html",
  styleUrls: ["./balance-recharge.component.scss"],
})
export class BalanceRechargeComponent implements OnInit {
  userBalance: IUserBalanceVM;
  myForm: FormGroup;
  CreditForm: FormGroup;
  submitted: boolean = false;
  CreditSubmitted: boolean = false;
  Teachers: IPaymentsTeachersVM[] = [];
  //Centers: any = [];
  results: any = [];
  msg: string;
  msgShow: boolean = false;
  @ViewChild("RechargeBtn", { read: ElementRef }) RechargeBtn: ElementRef;
  @ViewChild("ResetBtn", { read: ElementRef }) ResetBtn: ElementRef;
  constructor(
    private fb: FormBuilder,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService,
    private studentserv: StudentService,
    private TeacherSubServ: TeacherSubjectsService,
    private GenerateCodesService: GenerateCodesService
  ) {}

  ngOnInit(): void {
    this.balanceCheck();
    this.returnPaymentsTeachers();
    this.myForm = this.fb.group({
      methodId: ["", [Validators.required]],
      teacherId: ["", [Validators.required]],
      amount: ["", [Validators.required, CustomeValidator.rchargeAmount]],
      code: [""],
    });

    this.CreditForm = this.fb.group({
      card_number: ["", [Validators.required, CustomeValidator.noSpace]],
      expiry_year: [
        "",
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      expiry_month: [
        "",
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      cvv: [
        "",
        [Validators.required, Validators.maxLength(4), Validators.minLength(4)],
      ],
      amount: ["", [Validators.required, CustomeValidator.rchargeAmount]],
    });

    this.codeValidators();
  }

  ngAfterViewInit() {
    this.ResetBtn.nativeElement.style.display = "none";
  }

  codeValidators() {
    if (this.myForm.controls["methodId"].value == 0) {
      this.myForm.controls["code"].setValidators([
        Validators.required,
        CustomeValidator.whiteSpace,
      ]);
    } else {
      this.myForm.controls["code"].clearValidators();
    }
    this.myForm.controls["code"].updateValueAndValidity();
  }

  get FormCtrls() {
    return this.myForm.controls;
  }
  get CreditFormCtrls() {
    return this.CreditForm.controls;
  }

  balanceCheck() {
    this.spinner.show();
    this.studentserv.balanceCheck<IUserBalanceVM>().subscribe((res) => {
      this.userBalance = res;
      this.spinner.hide();
    });
  }

  // Check teacher Service Provider
  checkTeacher() {
    this.submitted = true;
    let amount = this.myForm.value.amount;
    let teacherId = this.myForm.value.teacherId;
    let methodId = this.myForm.value.methodId;
    if (this.myForm.valid) {
      let teacher = this.Teachers.find(
        (x: any) => x.teacherUserId == this.myForm.value.teacherId
      );
      let EduCompId = teacher.EduComp.Id;
      this.payAmount(amount, teacherId, EduCompId, methodId);
    }
  }

  payAmount(amount: any, teacherId: any, EduCompId: any, methodId: any) {
    this.spinner.show();
    this.studentserv
      .payAmount(amount, teacherId, EduCompId, methodId)
      .subscribe((res: any) => {
        this.RechargeBtn.nativeElement.style.display = "none";
        this.ResetBtn.nativeElement.style.display = "block";
        this.submitted = false;
        this.msgShow = false;
        if (res.returnValue == 1) {
          this.toaster.success("تم طلب الكود ستصلك رساله قريباً");
          this.results = res;
        } else {
          //this.toaster.error('حدث  خطأ  ما حاول مره اخري لاحقاً');
          this.toaster.error(res.returnString || res.message);
        }
        this.spinner.hide();
      });
  }

  payAmountCredit() {
    this.studentserv
      .payAmountCredit(this.CreditForm.value)
      .subscribe((res: any) => {
        if (res.returnValue == 1) {
          this.toaster.success("تم الشحن");
          this.results = res;
        } else if (res.returnValue != 1) {
          this.toaster.error(res);
        }
      });
  }

  applyBalanceCode() {
    if (!this.FormCtrls.code.value) {
      this.toaster.warning("Must Enter Code!");
      return;
    } else {
      this.spinner.show();
      this.GenerateCodesService.applyBalanceCode(
        this.FormCtrls.code.value
      ).subscribe((res: any) => {
        if (res.returnValue == 1) {
          this.balanceCheck();
          this.toaster.success("تم شحن الرصيد");
        } else this.toaster.warning(res.returnString);
        this.spinner.hide();
      });
    }
    //else this.toaster.error("Please Enter Code Or Serial ");
  }

  returnPaymentsTeachers() {
    this.TeacherSubServ.TeachersPayments<IPaymentsTeachersVM[]>().subscribe(
      (res) => {
        this.Teachers = res;
      }
    );
  }

  ShowMsg(teacherId: number) {
    let teacher = this.Teachers.find((x: any) => x.teacherUserId == teacherId);
    this.msgShow = true;
    this.msg =
      "  سوف يتم شحن  ' " +
      this.FormCtrls.amount.value +
      " '  جنيهاَ للمدرس : " +
      teacher.ar_name +
      "  في سنتر   :  " +
      teacher.EduComp.Name;
  }

  Reset() {
    this.RechargeBtn.nativeElement.style.display = "block";
    this.ResetBtn.nativeElement.style.display = "none";
    this.results = [];
    this.myForm.reset();
  }

  // returnCenterByUser() {
  //   this.TeacherSubServ.returnCenterByUser().subscribe((res: any) => {
  //     this.Centers = res;
  //     console.log("centers", res);
  //   });
  // }
}
