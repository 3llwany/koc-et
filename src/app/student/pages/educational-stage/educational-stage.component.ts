import { ToastrService } from "ngx-toastr";
import { CustomeValidator } from "./../../../shared/validators/customeValid.validator";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import { GeneralService } from "app/shared/services/General/general.service";
import { StudentService } from "app/student/services/student.service";
import { IStageDropVM, IYearDropVM } from "app/shared/models/general/general";
import { IGetStudentStageVM } from "app/student/models/student";

@Component({
  selector: "app-educational-stage",
  templateUrl: "./educational-stage.component.html",
  styleUrls: ["./educational-stage.component.scss"],
})
export class EducationalStageComponent implements OnInit {
  myForm: FormGroup;
  submitted = false;
  EduStages: IStageDropVM[] = [];
  EduYears: IYearDropVM[] = [];
  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private generalServ: GeneralService,
    private studentServ: StudentService
  ) {}

  ngOnInit(): void {
    this.getEduStagesList();
    this.getStudenStageData();
    this.myForm = this.fb.group({
      stageID: ["", [Validators.required]],
      EduYearID: ["", [Validators.required]],
      parentName: [
        "",
        [
          Validators.required,
          CustomeValidator.whiteSpace,
          Validators.pattern(
            /^[a-zA-Z \u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+$/
          ),
        ],
      ],

      parent2Name: [""],

      parentPhoneNumber: [
        "",
        [
          Validators.required,
          Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_\-\(\)\S*$]*$/),
          Validators.minLength(11),
          Validators.maxLength(11),
          CustomeValidator.startsWith,
        ],
      ],

      parent2PhoneNumber: [""],
    });
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  getEduStagesList() {
    this.generalServ.getAllEduStagesList<IStageDropVM[]>().subscribe((res) => {
      this.EduStages = res;
    });
  }

  getEduYearByStageId(stageId: any) {
    this.EduYears = [];
    this.FormCtrls.EduYearID.setValue("");
    if (stageId) {
      this.generalServ
        .getEduYearByStageId<IYearDropVM[]>(stageId)
        .subscribe((res) => {
          this.EduYears = res;
        });
    }
  }

  // Save Student Educational Stage Data
  SaveStudenStage() {
    this.spinner.show();
    this.submitted = true;
    if (this.myForm.valid) {
      this.studentServ
        .SaveStudenStage(this.myForm.value)
        .subscribe((res: any) => {
          if (res.returnValue == 1) {
            this.getStudenStageData();
            this.toastr.success("تم تغير  بيانات المرحلة التعليمية بنجاح");
          } else {
            this.toastr.error(res.returnString);
          }
          this.submitted = false;
          this.spinner.hide();
        });
    }
  }

  getStudenStageData() {
    this.spinner.show();
    this.studentServ
      .getStudenStageData<IGetStudentStageVM>()
      .subscribe((res) => {
        console.log(res);
        this.spinner.hide();
        this.getEduYearByStageId(res.selectedStageId);
        this.FormCtrls.stageID.setValue(res.selectedStageId);
        this.FormCtrls.EduYearID.setValue(res.selectedYearId);
        this.myForm.patchValue(res);
        this.myForm.patchValue(res.student);
      });
  }
}
