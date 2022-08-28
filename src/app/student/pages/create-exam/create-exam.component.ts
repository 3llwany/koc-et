import { teacherByEduCompId } from "./../../../shared/models/general/general";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerModule } from "ngx-spinner";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { CreateTemplateService } from "app/student/services/CreateTemplate.service";
import { EducationalService } from "app/admin/services/Admin/educational.service";
import { Stage, subject, year } from "app/admin/models/admin/educations";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { StudentService } from "app/student/services/student.service";

@Component({
  selector: "app-create-exam",
  templateUrl: "./create-exam.component.html",
  styleUrls: ["./create-exam.component.scss"],
})
export class CreateExamComponent implements OnInit {
  teachers: teacherByEduCompId[] = [];
  stages: Stage[] = [];
  years: year[] = [];
  subjects: subject[] = [];
  units: any = [];
  lessons: any = [];
  lessons2: any = [];
  topics: any = [];

  templateDetails: any[] = [];

  creatForm!: FormGroup;
  creatSubmitted = false;
  DetailForm!: FormGroup;
  DetailSubmitted = false;
  template_ID: number;

  constructor(
    private fb: FormBuilder,
    private spinner: NgxSpinnerModule,
    private toastr: ToastrService,
    private EducationalService: EducationalService,
    private templateServ: CreateTemplateService,
    private StudentServ: StudentService
  ) {}

  ngOnInit(): void {
    this.getTeachers();
    this.creatForm = this.fb.group({
      teacherId: ["", Validators.required],
      stageId: ["", Validators.required],
      yearId: ["", Validators.required],
      subjectId: ["", Validators.required],
      UnitRevisionID: ["", Validators.required],
      LessonID: ["", Validators.required],
      exam_hour: [0, [Validators.required, CustomeValidator.minusNum]],
      exam_minute: [0, [Validators.required, CustomeValidator.minusNum]],
      Name: ["", [Validators.required, CustomeValidator.whiteSpace]],
    });

    this.DetailForm = this.fb.group({
      templateId: [null, Validators.required],
      questionsLevel: [1, Validators.required],
      questionsCount: ["", [Validators.required, CustomeValidator.bigZero]],
      mark: ["", [Validators.required, CustomeValidator.bigZero]],
      unitRevisionID: ["", Validators.required],
      lessonID: ["", Validators.required],
      TopicID: [""],
    });
  }

  get CreatCtrl() {
    return this.creatForm.controls;
  }

  get DetailCtrl() {
    return this.DetailForm.controls;
  }

  createStudentTemplate() {
    this.creatSubmitted = true;
    let valid = this.creatForm.valid;
    // console.log('add', this.creatForm.value);
    if (valid) {
      this.templateServ
        .createStudentTemplate(this.creatForm.value)
        .subscribe((res: any) => {
          console.log("create", res);
          if (res.returnValue == 1) {
            this.CreatCtrl.Id.setValue(res.template_ID);
            this.DetailCtrl.templateId.setValue(res.template_ID);
            this.template_ID = res.template_ID;
            this.creatSubmitted = false;
            this.DetailCtrl.questionsCount.enable();
            this.DetailCtrl.unitRevisionID.enable();
            this.DetailCtrl.lessonID.enable();
            this.DetailCtrl.TopicID.enable();
            // this.creatForm.reset();
            this.toastr.success("Done");
          } else {
            this.toastr.error(res.returnString);
          }
        });
    }
  }

  SaveTemplateDetail() {
    this.DetailSubmitted = true;
    let valid = this.DetailForm.valid;
    if (valid) {
      this.templateServ
        .addTemplateDetail(this.DetailForm.value)
        .subscribe((res: any) => {
          console.log(res);
          if (res.returnValue == 1) {
            this.DetailSubmitted = false;
            this.getTemplateDetails();
            this.toastr.success("Questions added");
            this.DetailCtrl.questionsCount.reset();
            this.DetailCtrl.mark.reset();
            this.DetailCtrl.unitRevisionID.reset();
            this.DetailCtrl.lessonID.reset();
            this.DetailCtrl.TopicID.reset();
            this.DetailSubmitted = false;
          } else {
            this.toastr.error(res.returnString);
          }
        });
    }
  }

  getTemplateDetails() {
    this.templateServ
      .getTemplateDetails(this.template_ID)
      .subscribe((res: any) => {
        console.log("getDetails", res);
        this.templateDetails = res;
      });
  }

  DeleteDetails(DetailsId: any) {
    let confirmed = confirm("are you sure?");
    if (confirmed) {
      this.templateServ.DeleteDetails(DetailsId).subscribe((res: any) => {
        if (res.Id == DetailsId) {
          console.log("DeleteDetails: ", res);
          let deletedIndex = this.templateDetails.findIndex(
            (e) => e.Id == DetailsId
          );
          this.templateDetails.splice(deletedIndex, 1);
          this.toastr.success("Deleted");
        }
      });
    }
  }

  getTeachers() {
    this.templateServ.getTeachers().subscribe((res: any) => {
      this.teachers = res;
      console.log(res);
    });
  }

  getStageByTeacherId(teacherId: any) {
    this.stages = [];
    this.years = [];
    this.subjects = [];
    this.units = [];
    this.lessons = [];
    this.topics = [];
    this.CreatCtrl.stageId.setValue("");
    if (teacherId) {
      this.EducationalService.getStageByTeacherId(teacherId).subscribe(
        (res: any) => {
          this.stages = res;
          console.log(res);
        }
      );
    }
  }

  returnYears(stageId: any) {
    if (stageId) {
      this.EducationalService.returnYears(stageId).subscribe((res: any) => {
        this.years = res;
        //console.log(res);
      });
    }
  }

  returnTeacherSubjects(yearId: any) {
    let data = {
      yearId: yearId,
      teacherUserId: this.CreatCtrl.teacherId.value,
    };

    if (yearId) {
      this.EducationalService.returnTeacherSubjects(data).subscribe(
        (res: any) => {
          this.subjects = res;
          // console.log(res);
        }
      );
    }
  }

  GetUnits(SubjectId: any) {
    if (SubjectId) {
      this.EducationalService.GetUnits(SubjectId).subscribe((res: any) => {
        this.units = res;
        //  console.log(res);
      });
    }
  }

  GetLessons(unitId: any) {
    if (unitId) {
      this.EducationalService.GetLessons(unitId).subscribe((res: any) => {
        this.lessons = res;
        //console.log(res);
      });
    }
  }

  GetTopics(LessonId: any) {
    if (LessonId) {
      this.EducationalService.GetTopics(LessonId).subscribe((res: any) => {
        this.topics = res;
        //console.log(res);
      });
    }
  }
}
