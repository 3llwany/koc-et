import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { GeneralDropdownVM } from "app/admin/models/admin/educations";
import { ISubjectVM } from "app/shared/models/general/general";
import { GeneralService } from "app/shared/services/General/general.service";
import {
  ILecturesVM,
  IGenerateCodeStudentDataVM,
} from "app/support/models/support";
import { SupportService } from "app/support/services/support.service";
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-generate-student-code",
  templateUrl: "./generate-student-code.component.html",
  styleUrls: ["./generate-student-code.component.scss"],
})
export class GenerateStudentCodeComponent implements OnInit {
  myForm: FormGroup;
  userId: number;
  Results: any;
  studentData: IGenerateCodeStudentDataVM;
  subjects: ISubjectVM[];
  Teachers: GeneralDropdownVM[];
  Lectures: ILecturesVM[];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private SupportService: SupportService,
    private GeneralService: GeneralService,
    private spinner: NgxSpinnerService
  ) {
    route.paramMap.subscribe((params) => {
      this.userId = Number(params.get("userId"));
    });
  }

  ngOnInit(): void {
    this.getStudentDataGenerateCode();
    this.myForm = this.fb.group({
      subjectId: ["", [Validators.required]],
      teacherId: ["", [Validators.required]],
      materialId: ["", [Validators.required]],
      userId: ["", [Validators.required]],
    });
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  getStudentDataGenerateCode() {
    this.spinner.show();
    this.SupportService.getStudentDataGenerateCode<IGenerateCodeStudentDataVM>(
      this.userId
    ).subscribe((res) => {
      this.studentData = res;
      this.subjects = res.studentSubjects;
      this.spinner.hide();
    });
  }

  GenerateCode() {
    this.FormCtrls.userId.setValue(this.userId);
    if (this.myForm.valid) {
      this.spinner.show();
      this.SupportService.GenerateCode(this.myForm.value).subscribe(
        (res: any) => {
          this.Results = res.returnString;
          this.spinner.hide();
        }
      );
    }
  }

  getTeachersBySubjectId(subjectId: number) {
    this.Teachers = [];
    this.Lectures = [];
    this.FormCtrls.teacherId.setValue("");
    this.FormCtrls.materialId.setValue("");
    if (subjectId) {
      this.GeneralService.getTeachersBySubjectId<GeneralDropdownVM[]>(
        subjectId
      ).subscribe((res) => {
        this.Teachers = res;
      });
    }
  }

  getTeachersMaterials() {
    this.Lectures = [];
    this.FormCtrls.materialId.setValue("");
    if (this.FormCtrls.teacherId.value) {
      this.GeneralService.getTeachersMaterials<GeneralDropdownVM[]>(
        this.FormCtrls.subjectId.value,
        this.FormCtrls.teacherId.value
      ).subscribe((res) => {
        this.Lectures = res;
      });
    }
  }
}
