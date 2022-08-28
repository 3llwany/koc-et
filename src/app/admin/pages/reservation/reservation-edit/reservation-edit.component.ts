import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, NgForm, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import {
  Areas,
  CenterBranchesVM,
  EducationalDivisionsVM,
  EducationTypesVM,
  GendersVM,
  IFileToUpload,
  IGetReservationEditVM,
  ISubmitReservationEditVM,
  ReligionsVM,
} from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-reservation-edit",
  templateUrl: "./reservation-edit.component.html",
  styleUrls: ["./reservation-edit.component.scss"],
})
export class ReservationEditComponent implements OnInit {
  reservationId: number;
  EduCompId: any;
  functionId: any;
  myForm: FormGroup;
  submitted: boolean = false;
  ProfilePicture_Path: any;
  ProfilePicture: any;
  Religions: ReligionsVM[];
  Genders: GendersVM[];
  EducationalDivisions: EducationalDivisionsVM[];
  EducationTypes: EducationTypesVM[];
  Areas: Areas[];
  CenterBranches: CenterBranchesVM[];

  constructor(
    private reservationServ: ReservationService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private authserv: AuthService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.reservationId = Number(params.get("reservationId"));
    });
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
    });
  }

  ngOnInit(): void {
    this.EduCompId = this.authserv.getEduCompId();
    this.getReservationEdit(this.reservationId);

    this.myForm = this.fb.group({
      userId: [this.reservationId, [Validators.required]],
      Id: ["", [Validators.required]],
      UserName: ["", [Validators.required, CustomeValidator.whiteSpace]],
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

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.FormCtrls?.EduCompIdCtrl.setValue(e.EduCompId);
    });
  }

  getReservationEdit(reservationId: any) {
    this.spinner.show();
    this.reservationServ
      .getReservationEdit<IGetReservationEditVM>(reservationId, this.EduCompId)
      .subscribe((res) => {
        // console.log("ReservationEditr", res);
        this.myForm.patchValue(res.Reservation);
        this.Religions = res.Religion;
        this.Genders = res.Gender;
        this.EducationalDivisions = res.EducationalDivision;
        this.EducationTypes = res.EducationTypeId;
        this.Areas = res.Area;
        this.ProfilePicture = res.Reservation?.ProfilePicture_Path;
        this.ProfilePicture_Path = `mozakretyapi${res.Reservation?.ProfilePicture_Path}`;
        this.returnBranchesByEducTypeId(res.Reservation?.EducationTypeId);
        this.spinner.hide();
      });
  }

  SubmitReservation() {
    if (!(this.ProfilePicture || this.ProfilePicture_Path)) {
      this.toaster.warning("يجب اختيار صوره شخصية");
      return;
    }

    let data: ISubmitReservationEditVM = {
      Reservation: this.myForm.value,
      profilePicture: this.ProfilePicture || this.ProfilePicture_Path,
    };

    if (this.myForm.valid) {
      this.spinner.show();
      this.reservationServ.SubmitReservationEdit(data).subscribe((res: any) => {
        //  console.log(res);
        if (res.returnValue == 200 && res.returnString == "Success") {
          this.toaster.success("تم تغير البيانات بنجاح");
        } else {
          this.toaster.error(res.returnString, res.returnValue);
        }
        this.spinner.hide();
      });
    }
  }

  returnBranchesByEducTypeId(typeId: any) {
    this.CenterBranches = [];
    this.reservationServ
      .returnBranchesByEducTypeId<CenterBranchesVM[]>(typeId, this.EduCompId)
      .subscribe((res) => {
        this.CenterBranches = res;
      });
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
          FileAsBase64: fileReder,
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        this.ProfilePicture_Path = fileReder;
        this.ProfilePicture = data;
      };
    }
  }
}
