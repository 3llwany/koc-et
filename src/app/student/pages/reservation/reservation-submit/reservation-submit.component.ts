import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  Areas,
  CenterBranchesVM,
  EducationalDivisionsVM,
  EducationTypesVM,
  GendersVM,
  IStudentReservationVM,
  ReligionsVM,
} from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { StudentService } from "app/student/services/student.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-reservation-submit",
  templateUrl: "./reservation-submit.component.html",
  styleUrls: ["./reservation-submit.component.scss"],
})
export class ReservationSubmitComponent implements OnInit {
  code: string;
  viewId: number;
  EduCompId: number;
  currentYear: number;
  teacherId: number;
  userId: number;
  ProfilePicture?: any;
  myForm: FormGroup;
  submitted: boolean = false;
  isUpdate: any = "false";
  confirmURL: string;

  inputs: any = [];
  EducationTypes: EducationTypesVM[] = [];
  CenterBranches: CenterBranchesVM[] = [];
  OnlineBranches: CenterBranchesVM[] = [];
  EducationalDivisions: EducationalDivisionsVM[] = [];
  Genders: GendersVM[] = [];
  Areas: Areas[] = [];
  Religions: ReligionsVM[] = [];
  userData: any;
  previewImg?: any;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private StudentServ: StudentService,
    private ReservationService: ReservationService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.route.parent?.paramMap.subscribe((params) => {
      this.code = params.get("code");
      this.viewId = Number(params.get("viewId"));
      this.EduCompId = Number(params.get("EduCompId"));
      this.currentYear = Number(params.get("currentYear"));
      this.teacherId = Number(params.get("teacherId"));
    });
    this.route.parent?.queryParamMap.subscribe((params) => {
      this.isUpdate = params.get("isUpdate");
    });
    this.confirmURL = `student/reservation/${this.teacherId}/${this.EduCompId}/${this.viewId}/${this.code}/${this.currentYear}/confirm-reservation`;
  }

  ngOnInit(): void {
    this.returnInputsByViewEduCompId(this.EduCompId, this.viewId);
    this.getReservationInfo();
    this.getCustomReservation();
    this.myForm = this.fb.group({
      userId: ["", [Validators.required]],
      UserName: ["", [Validators.required, CustomeValidator.whiteSpace]],
      ProfilePicture: [null],
      ProfilePicture_Path: [null],
      Religion: ["", [Validators.required]],
      Gender: ["", [Validators.required]],
      EducationTypeId: ["", [Validators.required]],
      CenterBranchId: ["", [Validators.required]],
      SchoolName: ["", [Validators.required, CustomeValidator.whiteSpace]],
      EducationalDivision: ["", [Validators.required]],
      GuardianJob: ["", [Validators.required, CustomeValidator.whiteSpace]],
      Area: ["", [Validators.required]],
      Address: ["", [Validators.required, CustomeValidator.whiteSpace]],

      StudentNumber: [
        "",
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/),
          CustomeValidator.startsWith,
        ],
      ],

      StudentWhatsAppNumber: [
        "",
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/),
          CustomeValidator.startsWith,
        ],
      ],

      FatherMobile: [
        "",
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/),
          CustomeValidator.startsWith,
        ],
      ],

      FatherWhatsAppNumber: [
        "",
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/),
          CustomeValidator.startsWith,
        ],
      ],

      MotherMobile: [
        "",
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/),
          CustomeValidator.startsWith,
        ],
      ],

      MotherWhatsAppNumber: [
        "",
        [
          Validators.required,
          Validators.maxLength(11),
          Validators.minLength(11),
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/),
          CustomeValidator.startsWith,
        ],
      ],

      HomeTelephone: [
        "",
        [Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\- \(\)]*$/)],
      ],
      SentviewId: ["", [Validators.required]],
      currentYear: ["", [Validators.required]],
      EduCompId: ["", [Validators.required]],
      City: [""],
      competitions: [""],
      Hobbies: [""],
      workshops: [""],
    });
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  getReservationInfo() {
    this.spinner.show();
    this.ReservationService.getReservationInfo<IStudentReservationVM>(
      this.EduCompId
    ).subscribe((res) => {
      //console.log("getReservationInfo", res);
      if (res) {
        if (res != null && this.isUpdate != "true") {
          this.router.navigateByUrl(this.confirmURL);
        } else {
          this.previewImg = `mozakretyapi${res.ProfilePicture_Path}`;
          this.returnBranchesByEducTypeId(res.EducationTypeId);
          this.myForm.patchValue(res);
        }
      }
      this.spinner.hide();
    });
  }

  getCustomReservation() {
    this.ReservationService.getCustomReservation(this.EduCompId).subscribe(
      (res: any) => {
        //    console.log("getCustomReservation", res);
        this.EducationTypes = res.EducationTypes;
        // this.CenterBranches = res.CenterBranches;
        //  this.CenterBranches = res.CenterBranches;
        this.EducationalDivisions = res.EducationalDivisions;
        this.Genders = res.Genders;
        this.Areas = res.Areas;
        this.Religions = res.Religions;
      }
    );
  }

  SubmitStaticReservation() {
    this.submitted = true;
    this.FormCtrls.userId.setValue(this.userId);
    this.FormCtrls.EduCompId.setValue(this.EduCompId);
    this.FormCtrls.SentviewId.setValue(this.viewId);
    this.FormCtrls.currentYear.setValue(this.currentYear);
    if (this.myForm.valid) {
      if (
        this.FormCtrls.ProfilePicture.value == null &&
        this.FormCtrls.ProfilePicture_Path.value == null
      )
        this.toastr.warning("من فضلك اختار صورة شخصية");
      else {
        this.spinner.show();
        this.StudentServ.SubmitReservation(this.myForm.value).subscribe(
          (res: any) => {
            this.submitted = false;
            //   console.log(res);
            if (res.returnValue == 200 && res.returnString == "Success") {
              this.toastr.success("تم حفظ البيانات ");
              this.router.navigateByUrl(this.confirmURL);
            } else if (
              res.returnValue == 505 &&
              res.returnString == "Reservation submitted before"
            ) {
              this.toastr.error("تم التسجيل من قبل");
            } else {
              this.toastr.error(res.returnString);
            }
            this.spinner.show();
          }
        );
      }
    }
  }

  returnInputsByViewEduCompId(EduCompId: any, viewId: any) {
    this.StudentServ.returnInputsByViewEduCompId(EduCompId, viewId).subscribe(
      (res: any) => {
        this.inputs = res.list;
        this.userData = res;
        this.userId = res.userId;
      }
    );
  }

  returnBranchesByEducTypeId(typeId: any) {
    this.CenterBranches = [];
    this.FormCtrls.CenterBranchId.setValue("");
    if (typeId) {
      this.ReservationService.returnBranchesByEducTypeId(
        typeId,
        this.EduCompId
      ).subscribe((res: any) => {
        this.CenterBranches = res;
      });
    }
  }

  // Select New Profile Picture
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
        this.previewImg = fileReder;
        let data = {
          FileAsBase64: fileReder,
          name: fileName,
          size: fileSize,
          type: fileType,
        };
        this.ProfilePicture = data;
        this.FormCtrls.ProfilePicture.setValue(data);
      };
    }
  }
}
