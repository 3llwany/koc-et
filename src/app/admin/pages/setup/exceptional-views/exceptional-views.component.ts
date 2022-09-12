import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { CashPaymentService } from "app/admin/services/Admin/cash-payment.service";
import { EducationalService } from "app/admin/services/Admin/educational.service";
import { ManageViewsService } from "app/admin/services/Admin/manage-views.service";
import {
  teacherByEduCompId,
  GeneralDropdownVM,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-exceptional-views",
  templateUrl: "./exceptional-views.component.html",
  styleUrls: ["./exceptional-views.component.scss"],
})
export class ExceptionalViewsComponent implements OnInit {
  Teachers: teacherByEduCompId[];
  stages: GeneralDropdownVM[];
  years: GeneralDropdownVM[];
  subjects: GeneralDropdownVM[];
  units: GeneralDropdownVM[];
  lessons: GeneralDropdownVM[];
  lectures: GeneralDropdownVM[];
  materials: GeneralDropdownVM[];
  EduCompId: number;
  branchId: number;
  searchForm!: FormGroup;
  resetForm!: FormGroup;
  submitted = false;
  email?: string = "";
  username?: string = "";
  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private ManageViewsService: ManageViewsService,
    private toastr: ToastrService,
    private GeneralService: GeneralService,
    private EducationalService: EducationalService,
    private CashPaymentService: CashPaymentService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.EduCompId = Number(this.authService.getEduCompId());
    this.branchId = Number(this.authService.getEduCompId());
    this.getTeachersByEducompId();

    this.searchForm = this.fb.group({
      sentCode: [""],
      sentCenterCode: [""],
      sentMobile: [""],
      sentEmail: [""],
      InCenter: [true],
    });

    this.resetForm = this.fb.group({
      userId: [null, [Validators.required]],
      itemId: ["", [Validators.required]],
      itemTypeId: [15],
      paymentMethod: ["", [Validators.required]],
      extraViews: ["", [Validators.required, CustomeValidator.bigZero]],
      paidAmount: ["", [Validators.required, CustomeValidator.minusNum]],
      toDate: ["", [Validators.required]],
      resetTemplate: [false],
      teacherUserId: [""],
      stageId: [""],
      yearId: [""],
      subjectId: [""],
      unitId: [""],
      lessonId: [""],
    });
  }

  get resetFormCtrl() {
    return this.resetForm.controls;
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

  searchStudent() {
    this.spinner.show();
    this.ManageViewsService.searchStudent(
      this.EduCompId,
      this.searchForm.value
    ).subscribe((res: any) => {
      if (res.returnValue == 1) {
        this.email = res.email;
        this.username = res.username;
        this.resetFormCtrl.userId.setValue(res.userId);
        this.resetFormCtrl.yearId.setValue(res.yearId);
      } else {
        this.toastr.error(res.returnString);
      }
      this.spinner.hide();
    });
  }

  addExceptionalViews() {
    this.submitted = true;
    if (!this.resetFormCtrl.itemTypeId.value) {
      this.toastr.warning("Must Select ");
    }
    if (this.resetForm.valid) {
      this.spinner.show();
      this.ManageViewsService.addExceptionalViews(
        this.EduCompId,
        this.resetForm.value
      ).subscribe((res: any) => {
        if (res.returnValue == 1) {
          this.resetForm.reset();
          this.searchForm.reset();
          this.toastr.success("تم إضافة المشاهدات");
        } else {
          this.toastr.error(res.returnString);
        }

        this.spinner.hide();
      });
    }
  }

  //Get Teachers By EduCompID
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

  getSubjectByTeacherId() {
    this.lessons = [];
    this.units = [];
    this.subjects = [];
    this.materials = [];
    if (this.resetFormCtrl.yearId.value) {
      this.GeneralService.getSubjectByTeacherId(
        this.resetFormCtrl.teacherUserId.value,
        this.resetFormCtrl.yearId.value
      ).subscribe((res: any) => {
        this.subjects = res.lsts;
      });
    }
  }

  //  getStageByTeacherId(teacherId: any) {
  //   this.lessons = [];
  //   this.units = [];
  //   this.subjects = [];
  //   this.years = [];
  //   this.stages = [];
  //   this.materials = [];
  //   if (this.resetFormCtrl.teacherUserId.value) {
  //     this.EducationalService.getStageByTeacherId(teacherId).subscribe(
  //       (res: any) => {
  //         this.stages = res;
  //        }
  //     );
  //   }
  // }

  //  getYearsByStageId(stageId: any) {
  //   this.lessons = [];
  //   this.units = [];
  //   this.subjects = [];
  //   this.years = [];
  //   this.materials = [];
  //   if (this.resetFormCtrl.stageId.value) {
  //     this.EducationalService.returnYears(stageId).subscribe((res: any) => {
  //       this.years = res;
  //      });
  //   }
  // }

  //  getSubjectsByYearId(yearId: any, teacherId: any) {
  //   this.lessons = [];
  //   this.units = [];
  //   this.subjects = [];
  //   this.materials = [];
  //   if (this.resetFormCtrl.yearId.value) {
  //     let data = {
  //       yearId: yearId,
  //       teacherUserId: teacherId,
  //     };
  //     this.EducationalService.returnTeacherSubjects(data).subscribe(
  //       (res: any) => {
  //         this.subjects = res;
  //        }
  //     );
  //   }
  // }

  //return Units BY SubjectId
  getUnitsBySubjectId(SubjectId: any) {
    this.lessons = [];
    this.units = [];
    this.materials = [];
    if (this.resetFormCtrl.subjectId.value) {
      this.EducationalService.GetUnits(SubjectId).subscribe((res: any) => {
        this.units = res;
        //console.log(res);
      });
      // this.GetItemsBySubject(SubjectId);
    }
  }

  //return Lessons BY unitId
  getLessonsByUnitId(unitId: any) {
    this.lessons = [];
    this.materials = [];
    if (this.resetFormCtrl.unitId.value) {
      this.EducationalService.GetLessons(unitId).subscribe((res: any) => {
        this.lessons = res;
        //console.log(res);
      });
      // this.GetItemsByUnit(unitId);
    }
  }

  GetItemsByLessonWithEnded(lessonId: any, teacherId: any) {
    this.CashPaymentService.GetItemsByLessonWithEnded(
      this.EduCompId,
      lessonId,
      this.resetFormCtrl?.itemTypeId.value,
      teacherId,
      true
    ).subscribe((res: any) => {
      this.materials = res;
    });
  }

  GetItemsByUnit(unitId: any) {
    this.CashPaymentService.GetItemsByUnit(
      this.EduCompId,
      unitId,
      this.resetFormCtrl.itemTypeId.value,
      this.resetFormCtrl.teacherUserId.value
    ).subscribe((res: any) => {
      this.materials = res;
    });
  }

  GetItemsBySubject(subjectId: any) {
    this.CashPaymentService.GetItemsBySubject(
      this.EduCompId,
      subjectId,
      this.resetFormCtrl.itemTypeId.value,
      this.resetFormCtrl.teacherUserId.value
    ).subscribe((res: any) => {
      //   console.log('GetMaterialByLesson', res);
      this.materials = res;
    });
  }
}
