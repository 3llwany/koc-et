import { forkJoin } from "rxjs";
import { CashPaymentService } from "app/admin/services/Admin/cash-payment.service";
import { EducationalService } from "app/admin/services/Admin/educational.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { Component, OnInit } from "@angular/core";
import {
  Form,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  Validators,
} from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { ICahsPaymentsTableMV } from "app/admin/models/admin/cash-payment-table";
import {
  ErrorClass,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralDropdownVM } from "app/admin/models/admin/educations";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { NgxSpinnerService } from "ngx-spinner";

declare var $: any;
@Component({
  selector: "app-manual-cash-payment",
  templateUrl: "./manual-cash-payment.component.html",
  styleUrls: ["./manual-cash-payment.component.scss"],
})
export class ManualCashPaymentComponent implements OnInit {
  Errors: ErrorClass[] = [];
  Teachers: teacherByEduCompId[] = [];
  stages: GeneralDropdownVM[] = [];
  years: GeneralDropdownVM[] = [];
  subjects: GeneralDropdownVM[] = [];
  units: GeneralDropdownVM[] = [];
  lessons: GeneralDropdownVM[] = [];
  lectures: GeneralDropdownVM[] = [];
  materials: GeneralDropdownVM[] = [];
  userPaymentsHistories: ICahsPaymentsTableMV[] = [];
  EduCompId: any;
  branchId: any;
  searchForm!: FormGroup;
  paymentForm!: FormGroup;
  submitted = false;
  selectedUserDate: any = "";
  p: number = 1;
  maxSize = 9;
  itemsCount: any;
  PaymentByExcel: any = null;
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private CashPaymentService: CashPaymentService,
    private GeneralService: GeneralService,
    private EducationalService: EducationalService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.EduCompId = this.authService.getEduCompId();
    this.branchId = this.authService.getBranchId();
    this.getTeachersByEducompId();

    this.searchForm = this.fb.group({
      code: [""],
      mobile: [""],
      centerCode: [""],
      searchedMail: [""],
      searchedName: [""],
    });

    this.paymentForm = this.fb.group({
      userId: [null, [Validators.required]],
      itemId: [""],
      itemTypeId: [6],
      teacherUserId: ["", Validators.required],
      balance: [""],
      userMobile: [""],
      userEmail: [""],
      userName: [""],
      currentBalance: [""],
      uploadedFile: [""],
      itemPrice: [""],
      isPaymentExcel: [false],

      stageId: [""],
      yearId: [""],
      subjectId: [""],
      unitId: [""],
      lessonId: [""],
    });

    this.paymentForm.valueChanges.subscribe((e) => {
      this.getFormValidationErrors(this.paymentForm);
    });

    this.paymentFormCtrl.userMobile.disable();
    this.paymentFormCtrl.userEmail.disable();
    this.paymentFormCtrl.userName.disable();
    this.paymentFormCtrl.currentBalance.disable();
    this.paymentFormCtrl.itemPrice.disable();
    this.isPaymentExcelValidators();
    this.itemTypeIdValidators();
  }

  get paymentFormCtrl() {
    return this.paymentForm.controls;
  }

  ngAfterViewInit() {
    this.authService.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getTeachersByEducompId();
    });

    this.authService.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });
  }
  CashPaymentSearch() {
    this.spinner.show();
    this.CashPaymentService.CashPaymentSearch(
      this.searchForm.value,
      this.EduCompId
    ).subscribe((res: any) => {
      // console.log('PaymentSearch', res);
      if (res.model?.userId) {
        //  this.Teachers = res.lstTeachers;
        this.paymentFormCtrl.userId.setValue(res.model.userId);
        this.getPaymentsHistory();
        this.paymentFormCtrl.userMobile.setValue(res.model.userMobile);
        this.paymentFormCtrl.userEmail.setValue(res.model.userEmail);
        this.paymentFormCtrl.userName.setValue(res.model.userName);
        this.paymentFormCtrl.currentBalance.setValue(res.model.currentBalance);
      } else if (res.returnValue == 0) this.toastr.info(res.returnString);
      this.spinner.hide();
    });
  }

  AddCashPayment() {
    this.itemTypeIdValidators();
    this.isPaymentExcelValidators();

    this.submitted = true;
    // console.log('add', this.paymentForm.value);
    let valid = this.paymentForm.valid;
    if (valid) {
      this.spinner.show();
      this.CashPaymentService.CashPaymentPost(
        this.EduCompId,
        this.paymentForm.value
      ).subscribe((res: any) => {
        //  console.log('AddCashPayment', res);
        if (res.returnValue == 1 && res.returnString == "Success") {
          this.toastr.success("تم الدفع ");
          this.getPaymentsHistory();
          this.CashPaymentSearch();
          this.submitted = false;
        }
        this.spinner.hide();
      });
    }
  }

  ManualPaymentByExcel() {
    this.spinner.show();

    let data = {
      itemId: this.paymentFormCtrl.itemId.value,
      itemTypeId: this.paymentFormCtrl.itemTypeId.value,
      uploadedFile: this.paymentFormCtrl.uploadedFile.value,
    };
    console.log("Add", data);
    this.CashPaymentService.ManualPaymentByExcel(
      this.EduCompId,
      data
    ).subscribe((res: any) => {
      console.log("ByExcel", res);
      if (res.returnValue == 1) {
        this.toastr.success("تم الدفع ");
      } else console.log("ERROR_UPLOAD_EXCEL", res);
      this.spinner.hide();
    });
  }

  getPaymentsHistory() {
    this.spinner.show();
    this.CashPaymentService.getPaymentsHistory(
      this.p,
      this.paymentFormCtrl.userId.value
    ).subscribe((res: any) => {
      //console.log('getPaymentsHistory', res);
      this.userPaymentsHistories = res.userPayments;
      this.itemsCount = res.totalCount;
      this.spinner.hide();
    });
  }

  //  Get Teachers By EduCompID
  getTeachersByEducompId() {
    this.spinner.show();
    this.GeneralService.getTeachersByEducompId(this.EduCompId).subscribe(
      (res: any) => {
        // console.log(res);
        this.Teachers = res.lstTeachers;
        this.spinner.hide();
      }
    );
  }

  //get Stages By teacherId
  getStageByTeacherId(teacherUserId: any) {
    this.lessons = [];
    this.units = [];
    this.subjects = [];
    this.years = [];
    this.stages = [];
    this.materials = [];
    if (teacherUserId != "") {
      this.EducationalService.getStageByTeacherId(teacherUserId).subscribe(
        (res: any) => {
          this.stages = res;
          //console.log(res);
        }
      );
    }
  }

  //get Years BY stageId
  getYearsByStageId(stageId: any) {
    this.lessons = [];
    this.units = [];
    this.subjects = [];
    this.years = [];
    this.materials = [];
    if (stageId != "") {
      this.EducationalService.returnYears(stageId).subscribe((res: any) => {
        this.years = res;
        //console.log(res);
      });
    }
  }

  //return Teacher Subjects   //{ "yearId" : 36, "teacherId" : 17}
  getSubjectsByYearId(yearId: any, teacherUserId: any) {
    this.lessons = [];
    this.units = [];
    this.subjects = [];
    this.materials = [];
    if (yearId != "") {
      let data = {
        yearId: yearId,
        teacherUserId,
      };
      this.EducationalService.returnTeacherSubjects(data).subscribe(
        (res: any) => {
          this.subjects = res;
          //console.log(res);
        }
      );
    }
  }

  //return Units BY SubjectId
  getUnitsBySubjectId(SubjectId: any) {
    this.lessons = [];
    this.units = [];
    this.materials = [];
    if (SubjectId != "") {
      this.EducationalService.GetUnits(SubjectId).subscribe((res: any) => {
        this.units = res;
        //console.log(res);
      });

      this.GetItemsBySubject(SubjectId);
    }
  }

  //return Lessons BY unitId
  getLessonsByUnitId(unitId: any) {
    this.lessons = [];
    this.materials = [];
    if (unitId != "") {
      this.EducationalService.GetLessons(unitId).subscribe((res: any) => {
        this.lessons = res;
        //console.log(res);
      });
      this.GetItemsByUnit(unitId);
    }
  }

  GetItemsByLesson(lessonId: any) {
    this.CashPaymentService.GetItemsByLesson(
      this.EduCompId,
      lessonId,
      this.paymentFormCtrl.itemTypeId.value,
      this.paymentFormCtrl.teacherUserId.value
    ).subscribe((res: any) => {
      //   console.log('GetMaterialByLesson', res);
      this.materials = res;
    });
  }

  GetItemsByUnit(unitId: any) {
    this.CashPaymentService.GetItemsByUnit(
      this.EduCompId,
      unitId,
      this.paymentFormCtrl.itemTypeId.value,
      this.paymentFormCtrl.teacherUserId.value
    ).subscribe((res: any) => {
      this.materials = res;
    });
  }

  GetItemsBySubject(subjectId: any) {
    this.CashPaymentService.GetItemsBySubject(
      this.EduCompId,
      subjectId,
      this.paymentFormCtrl.itemTypeId.value,
      this.paymentFormCtrl.teacherUserId.value
    ).subscribe((res: any) => {
      //   console.log('GetMaterialByLesson', res);
      this.materials = res;
    });
  }

  geItemPrice() {
    if (
      this.paymentFormCtrl.isPaymentExcel.value == false &&
      this.paymentFormCtrl.itemId.value
    ) {
      this.CashPaymentService.geItemPrice(
        this.paymentFormCtrl.itemId.value,
        this.paymentFormCtrl.userId.value
      ).subscribe((res: any) => {
        if (res.returnValue == 1)
          this.paymentFormCtrl.itemPrice.setValue(res.price);
        else console.log("gerMaterialPrice", res);
      });
    }
  }

  isPaymentExcelValidators() {
    let isPaymentExcel = this.paymentFormCtrl.isPaymentExcel.value;
    if (isPaymentExcel == false) {
      this.paymentFormCtrl.uploadedFile.setValue("");
      this.paymentFormCtrl.uploadedFile.clearValidators();
    }

    if (isPaymentExcel == true) {
      this.paymentFormCtrl.uploadedFile.setValidators([Validators.required]);
    }

    this.paymentFormCtrl.itemTypeId.updateValueAndValidity();
    this.paymentFormCtrl.uploadedFile.updateValueAndValidity();
  }

  track(index: number, el: any): number {
    return el.userId;
  }

  getFormValidationErrors(form: FormGroup) {
    let totalErrors = 0;

    this.Errors = [];

    Object.keys(form.controls).forEach((key) => {
      const controlErrors: ValidationErrors = form.get(key).errors;
      if (controlErrors != null) {
        totalErrors++;
        Object.keys(controlErrors).forEach((keyError) => {
          // Errors.push(controlErrors[keyError]);
          this.Errors.push({ key: key, error: keyError });
        });
      }
    });
  }

  itemTypeIdValidators() {
    let itemTypeId = this.paymentFormCtrl.itemTypeId.value;
    if (itemTypeId == 4) {
      this.paymentFormCtrl.balance.setValidators([
        Validators.required,
        CustomeValidator.minusNum,
      ]);
      this.paymentFormCtrl.itemId.reset();
      this.paymentFormCtrl.itemId.clearValidators();
    }

    if (itemTypeId != 4) {
      this.paymentFormCtrl.itemId.setValidators([Validators.required]);
      this.paymentFormCtrl.balance.reset();
      this.paymentFormCtrl.balance.clearValidators();
    }

    this.paymentFormCtrl.itemId.updateValueAndValidity();
    this.paymentFormCtrl.balance.updateValueAndValidity();
  }

  onChange(event: any) {
    let fileName = <File>event.target.files[0].name;
    let fileSize = <File>event.target.files[0].size;
    let fileType = <File>event.target.files[0].type;
    let LastModified = <File>event.target.files[0].lastModified;
    let LastModifiedDate = <File>event.target.files[0].lastModifiedDate;

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        let fileReder = event.target.result;
        let data = {
          FileAsBase64: fileReder.replace(
            "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
            ""
          ),
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        this.PaymentByExcel = data;
        console.log(data);
        this.paymentForm.controls["uploadedFile"].setValue(data);
      };
    }
  }
}
