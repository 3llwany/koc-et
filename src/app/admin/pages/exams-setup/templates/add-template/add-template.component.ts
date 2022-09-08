import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { TemplateDetailsVM } from "app/admin/models/admin/exams";
import { EducationalService } from "app/admin/services/Admin/educational.service";
import {
  teacherByEduCompId,
  GeneralDropdownVM,
  IRowFunctionVM,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { TemplatesService } from "app/teacher/services/templates.service";
import { ToastrService } from "ngx-toastr";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";

@Component({
  selector: "app-add-template",
  templateUrl: "./add-template.component.html",
  styleUrls: ["./add-template.component.scss"],
})
export class AddTemplateComponent implements OnInit {
  EduCompId: any;
  branchId: any;
  p: number = 1;
  maxSize = 9;
  Teachers: teacherByEduCompId[] = [];
  QuestionDetails: TemplateDetailsVM[] = [];
  Presets: any = [];
  stages: GeneralDropdownVM[] = [];
  years: GeneralDropdownVM[] = [];
  subjects: GeneralDropdownVM[] = [];
  units: any = [];
  lessons: any = [];
  topics: any = [];
  unitsForDetails: GeneralDropdownVM[];
  lessonsForDetails: GeneralDropdownVM[];
  topicsForDetails: GeneralDropdownVM[];
  myForm!: FormGroup;
  DetailForm!: FormGroup;
  submitted = false;
  DetailSubmitted = false;
  templateId: any = null;
  templateName: string;
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    public spinner: NgxSpinnerService,
    public authserv: AuthService,
    private TemplatesService: TemplatesService,
    private dialog: MatDialog,
    private GeneralService: GeneralService,
    private EducationalService: EducationalService
  ) {
    route.queryParamMap.subscribe((params) => {
      this.templateId = params.get("templateId");
      this.functionId = Number(params.get("functionId"));
      //  console.log("functionId", this.functionId);
      if (this.templateId) {
        this.getTemplateById();
        this.getQuestionDetails(this.templateId);
      }
      if (this.functionId) {
        this.authserv
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
              //  console.log(`RowFunctions for"${this.functionId}": `, res);
            }
          });
      }
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      EduCompId: [this.EduCompId],
      Id: [this.templateId],
      presetTemplateId: [""],
      teacherUserId: ["", Validators.required],
      yearId: ["", Validators.required],
      stageId: ["", Validators.required],
      subjectId: ["", Validators.required],
      UnitRevisionID: [""],
      LessonID: [""],
      topicId: [""],
      Name: ["", [Validators.required, CustomeValidator.whiteSpace]],
      price: ["", [Validators.required, CustomeValidator.minusNum]],
      exam_minute: ["", [Validators.required, CustomeValidator.minusNum]],
      exam_hour: ["", [Validators.required, CustomeValidator.minusNum]],
      priceDiscount: [""],
      Avilable_Date_From: [""],
      priceDiscountType: [0],
      Avilable_Date_To: [""],
      fromHour: [""],
      toHour: [""],
      ResultDate: [""],
      ResultTime: [""],
      Individually_Purchased: [false],
      repeatableExam: [false],
      repeatableExam_Count: [false],
      SendWhatsApp: [false],
      CustomDiscountApplied: [false],
      StudentRepeatExamCost: [""],
      Publish: [false],
    });

    this.DetailForm = this.fb.group({
      templateId: [this.templateId, Validators.required],
      questionsLevel: ["", Validators.required],
      mark: ["", [Validators.required, CustomeValidator.minusNum]],
      questionsCount: ["", [Validators.required, CustomeValidator.bigZero]],
      unitRevisionID: ["", Validators.required],
      lessonID: ["", Validators.required],
      TopicID: [""],
    });

    if (this.templateId != null) {
      //  this.FormCtrl.Id.setValue(this.templateId);
      //  this.DetailsCtrl.templateId.setValue(this.templateId);
      //  this.getQuestionDetails(this.templateId);
    } else {
      this.FormCtrl.stageId.disable();
      this.FormCtrl.yearId.disable();
      this.FormCtrl.subjectId.disable();
      this.FormCtrl.UnitRevisionID.disable();
      this.FormCtrl.LessonID.disable();
      this.FormCtrl.topicId.disable();

      this.DetailsCtrl.questionsCount.disable();
      this.DetailsCtrl.unitRevisionID.disable();
      this.DetailsCtrl.lessonID.disable();
      this.DetailsCtrl.TopicID.disable();
      this.DetailsCtrl.mark.disable();
    }

    this.EduCompId = this.authserv.getEduCompId();
    this.branchId = this.authserv.getBranchId();
    this.getTeachersByEducompId(this.EduCompId);
    this.getPresets();

    this.FormCtrl.EduCompId.setValue(this.EduCompId);
    this.repeatableExamValidators();
  }

  get FormCtrl() {
    return this.myForm.controls;
  }

  get DetailsCtrl() {
    return this.DetailForm.controls;
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
    });

    this.authserv.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });
  }

  addUpdateTemplate() {
    this.submitted = true;
    let valid = this.myForm.valid;
    console.log(this.myForm.value);
    if (valid) {
      this.spinner.show();
      this.TemplatesService.addUpdateTemplate({
        presetTemplateId: this.FormCtrl.presetTemplateId.value,
        template: this.myForm.value,
      }).subscribe((res: any) => {
        console.log("createTemplate", res);
        if (res.returnValue) {
          this.DetailsCtrl.templateId.setValue(res.returnValue);
          this.FormCtrl.Id.setValue(res.returnValue);
          this.getQuestionDetails(res.returnValue);
          this.submitted = false;
          // this.myForm.reset();
          this.DetailsCtrl.questionsCount.enable();
          this.DetailsCtrl.unitRevisionID.enable();
          this.DetailsCtrl.lessonID.enable();
          this.DetailsCtrl.TopicID.enable();
          this.DetailsCtrl.mark.enable();
          this.toastr.success("Done");
          // } else {
          //this.toastr.error(res.returnString);
        }
        this.spinner.hide();
      });
    }
  }

  getTemplateById() {
    this.spinner.show();
    this.TemplatesService.getTemplateById(this.templateId).subscribe(
      (res: any) => {
        //   console.log("getTemplateById", res);

        this.getStageByTeacherId(res.teacherUserId);
        this.FormCtrl.teacherUserId.setValue(res.teacherUserId);
        this.returnYears(res.stage_id);
        this.returnTeacherSubjects(res.educational_year_id);
        this.GetUnits(res.subjectId);
        this.GetLessons(res.UnitRevisionID);
        this.GetTopics(res.LessonID);
        this.myForm.patchValue(res);
        this.myForm.patchValue(res);
        this.FormCtrl.stageId.setValue(String(res.stage_id));
        this.FormCtrl.yearId.setValue(String(res.educational_year_id));
        this.FormCtrl.subjectId.setValue(String(res.subjectId));
        this.FormCtrl.UnitRevisionID.setValue(String(res.UnitRevisionID));
        this.FormCtrl.LessonID.setValue(String(res.LessonID));
        this.templateName = res.Name;

        let exam_minute = res.exam_period_minute % 60;
        let exam_hour = (res.exam_period_minute - exam_minute) / 60;
        this.FormCtrl.exam_minute.setValue(exam_minute);
        this.FormCtrl.exam_hour.setValue(exam_hour);

        this.FormCtrl.fromHour.setValue(res.fromHour);
        this.FormCtrl.toHour.setValue(res.toHour);
        this.GetUnitsForDetails();
        this.spinner.hide();
      }
    );
  }

  addTemplateDetails() {
    this.DetailSubmitted = true;
    let valid = this.DetailForm.valid;
    // console.log(this.DetailForm.value);
    if (valid) {
      this.spinner.show();
      this.TemplatesService.addTemplateDetails(this.DetailForm.value).subscribe(
        (res: any) => {
          //     console.log("addDetails", res);
          if (res.returnValue == 1) {
            this.DetailSubmitted = false;
            // this.DetailForm.reset();
            this.getQuestionDetails(this.DetailsCtrl.templateId.value);
            this.DetailsCtrl.questionsCount.reset();
            this.DetailsCtrl.unitRevisionID.setValue("");
            this.DetailsCtrl.lessonID.setValue("");
            this.DetailsCtrl.TopicID.setValue("");
            this.DetailsCtrl.mark.reset();
            this.toastr.success("Questiopn added");
          } else {
            this.toastr.error(res.returnString);
          }
          this.spinner.hide();
        }
      );
    }
  }

  getQuestionDetails(templateId: any) {
    this.spinner.show();
    this.TemplatesService.getQuestionDetails(templateId).subscribe(
      (res: any) => {
        // console.log("getDetails", res);
        this.QuestionDetails = res;
        this.spinner.hide();
      }
    );
  }

  getPresets() {
    this.spinner.show();
    this.TemplatesService.getPresets(this.EduCompId).subscribe((res: any) => {
      // console.log('getPresets', res);
      this.Presets = res;
      this.spinner.hide();
    });
  }

  DeleteDetails(question: TemplateDetailsVM) {
    this.spinner.show();
    this.TemplatesService.DeleteDetails(question.Id).subscribe((res: any) => {
      //console.log('DeleteDetails', res);
      if (res.Id == question.Id) {
        let i = this.QuestionDetails.findIndex((e) => e == question);
        this.QuestionDetails.splice(i, 1);
        this.toastr.success(" Deleted");
      }
      this.spinner.hide();
    });
  }

  openDeleateDialog(question: TemplateDetailsVM): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: "",
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.DeleteDetails(question);
      });
  }

  getTeachersByEducompId(EduCompId: any) {
    this.GeneralService.getTeachersByEducompId(EduCompId).subscribe(
      (res: any) => {
        this.Teachers = res.lstTeachers;
      }
    );
  }

  getStageByTeacherId(teacherId: any) {
    this.FormCtrl.stageId.setValue("");
    this.FormCtrl.yearId.setValue("");
    this.FormCtrl.subjectId.setValue("");
    this.FormCtrl.UnitRevisionID.setValue("");
    this.FormCtrl.LessonID.setValue("");
    this.FormCtrl.topicId.setValue("");
    if (teacherId != "") {
      this.EducationalService.getStageByTeacherId(teacherId).subscribe(
        (res: any) => {
          this.stages = res;
          this.FormCtrl.stageId.enable();
          //console.log(res);
        }
      );
    } else {
      this.FormCtrl.stageId.setValue("");
      this.FormCtrl.stageId.disable();
      this.FormCtrl.yearId.disable();
      this.FormCtrl.subjectId.disable();
      this.FormCtrl.UnitRevisionID.disable();
      this.FormCtrl.LessonID.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  returnYears(stageId: any) {
    this.FormCtrl.yearId.setValue("");
    this.FormCtrl.subjectId.setValue("");
    this.FormCtrl.UnitRevisionID.setValue("");
    this.FormCtrl.LessonID.setValue("");
    this.FormCtrl.topicId.setValue("");
    if (stageId != "") {
      this.EducationalService.returnYears(stageId).subscribe((res: any) => {
        this.years = res;
        this.FormCtrl.yearId.enable();
      });
    } else {
      this.FormCtrl.yearId.setValue("");
      this.FormCtrl.yearId.disable();
      this.FormCtrl.subjectId.disable();
      this.FormCtrl.UnitRevisionID.disable();
      this.FormCtrl.LessonID.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  returnTeacherSubjects(yearId: any) {
    this.FormCtrl.subjectId.setValue("");
    this.FormCtrl.UnitRevisionID.setValue("");
    this.FormCtrl.LessonID.setValue("");
    this.FormCtrl.topicId.setValue("");
    if (yearId != "") {
      let data = {
        yearId: yearId,
        teacherUserId: this.FormCtrl.teacherUserId.value,
      };
      this.EducationalService.returnTeacherSubjects(data).subscribe(
        (res: any) => {
          this.subjects = res;
          this.FormCtrl.subjectId.enable();
        }
      );
    } else {
      this.FormCtrl.subjectId.setValue("");
      this.FormCtrl.subjectId.disable();
      this.FormCtrl.UnitRevisionID.disable();
      this.FormCtrl.LessonID.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  GetUnits(SubjectId: any) {
    this.FormCtrl.UnitRevisionID.setValue("");
    this.FormCtrl.LessonID.setValue("");
    this.FormCtrl.topicId.setValue("");
    if (SubjectId != "") {
      this.EducationalService.GetUnits(SubjectId).subscribe((res: any) => {
        this.units = res;
        this.FormCtrl.UnitRevisionID.enable();
      });
    } else {
      this.FormCtrl.UnitRevisionID.setValue("");
      this.FormCtrl.UnitRevisionID.disable();
      this.FormCtrl.LessonID.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  GetLessons(UnitRevisionID: any) {
    this.FormCtrl.LessonID.setValue("");
    this.FormCtrl.topicId.setValue("");
    if (UnitRevisionID != "") {
      this.EducationalService.GetLessons(UnitRevisionID).subscribe(
        (res: any) => {
          this.lessons = res;
          this.FormCtrl.LessonID.enable();
        }
      );
    } else {
      this.FormCtrl.LessonID.setValue("");
      this.FormCtrl.LessonID.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  GetTopics(LessonId: any) {
    this.FormCtrl.topicId.setValue("");
    if (LessonId != "") {
      this.EducationalService.GetTopics(LessonId).subscribe((res: any) => {
        this.topics = res;
        this.FormCtrl.topicId.enable();
      });
    } else {
      this.FormCtrl.topicId.setValue("");
      this.FormCtrl.topicId.disable();
    }
  }

  //#####################################################################
  GetUnitsForDetails() {
    this.DetailsCtrl.unitRevisionID.setValue("");
    this.DetailsCtrl.lessonID.setValue("");
    this.DetailsCtrl.TopicID.setValue("");
    if (this.FormCtrl.subjectId?.value) {
      this.EducationalService.GetUnits(
        this.FormCtrl.subjectId?.value
      ).subscribe((res: any) => {
        this.unitsForDetails = res;
        this.DetailsCtrl.unitRevisionID.enable();
      });
    } else {
      this.DetailsCtrl.unitRevisionID.setValue("");
      this.DetailsCtrl.UnitRevisionID.disable();
      this.DetailsCtrl.lessonID.disable();
      this.DetailsCtrl.TopicID.disable();
    }
  }

  GetLessonsForDetails(unitRevisionID: any) {
    this.DetailsCtrl.lessonID.setValue("");
    this.DetailsCtrl.TopicID.setValue("");
    if (unitRevisionID != "") {
      this.EducationalService.GetLessons(unitRevisionID).subscribe(
        (res: any) => {
          this.lessonsForDetails = res;
          this.DetailsCtrl.lessonID.enable();
        }
      );
    } else {
      this.DetailsCtrl.lessonID.setValue("");
      this.DetailsCtrl.lessonID.disable();
      this.DetailsCtrl.TopicID.disable();
    }
  }

  GetTopicsForDetails(LessonId: any) {
    this.DetailsCtrl.TopicID.setValue("");
    if (LessonId != "") {
      this.EducationalService.GetTopics(LessonId).subscribe((res: any) => {
        this.topicsForDetails = res;
        this.DetailsCtrl.TopicID.enable();
      });
    } else {
      this.DetailsCtrl.TopicID.setValue("");
      this.DetailsCtrl.TopicID.disable();
    }
  }

  resetManual() {
    this.myForm.controls["teacherUserId"].setValue("");
    this.myForm.controls["yearId"].setValue("");
    this.myForm.controls["stageId"].setValue("");
    this.myForm.controls["subjectId"].setValue("");
    this.myForm.controls["UnitRevisionID"].setValue("");
    this.myForm.controls["lessonId"].setValue("");
    this.myForm.controls["topicId"].setValue("");
  }

  track(index: number, el: any): number {
    return el.Id;
  }

  repeatableExamValidators() {
    let repeatableExam = this.FormCtrl.repeatableExam.value;
    if (repeatableExam == true) {
      this.FormCtrl.repeatableExam_Count.setValidators([
        Validators.required,
        CustomeValidator.minusNum,
      ]);

      this.FormCtrl.StudentRepeatExamCost.setValidators([
        Validators.required,
        CustomeValidator.minusNum,
      ]);
    } else {
      this.FormCtrl.repeatableExam_Count.clearValidators();
      this.FormCtrl.repeatableExam_Count.reset();
      this.FormCtrl.StudentRepeatExamCost.clearValidators();
      this.FormCtrl.StudentRepeatExamCost.reset();
    }
    this.FormCtrl.repeatableExam_Count.updateValueAndValidity();
    this.FormCtrl.StudentRepeatExamCost.updateValueAndValidity();
  }
}
