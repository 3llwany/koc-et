import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import {
  GeneralDropdownVM,
  IRowFunctionVM,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { EducationalService } from "app/admin/services/Admin/educational.service";
import { IEducationYearDropModel } from "app/admin/models/admin/exam";
import { TemplatesService } from "app/teacher/services/templates.service";
import { ActivatedRoute } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { TemplateVM } from "app/admin/models/admin/exams";
import { MatTableDataSource } from "@angular/material/table";
import { ToastrService } from "ngx-toastr";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
@Component({
  selector: "app-templates-index",
  templateUrl: "./templates-index.component.html",
  styleUrls: ["./templates-index.component.css"],
})
export class TemplatesIndexComponent implements OnInit {
  myForm!: FormGroup;
  functionId: number;
  itemsCount: any;
  Templates: TemplateVM[] = [];
  Teachers: teacherByEduCompId[] = [];
  stages: GeneralDropdownVM[] = [];
  years: GeneralDropdownVM[] = [];
  educationYears: IEducationYearDropModel[] = [];
  subjects: GeneralDropdownVM[] = [];
  units: any = [];
  lessons: any = [];
  topics: any = [];
  EduCompId: any;
  submitted = false;
  rowFunctions: IRowFunctionVM[];
  displayedColumns: string[] = [
    "Name",
    "Teacher",
    "Subject",
    "Year",
    "publish",
    "actions",
  ];
  dataSource: MatTableDataSource<TemplateVM>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private toastr: ToastrService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private GeneralService: GeneralService,
    private authserv: AuthService,
    private fb: FormBuilder,
    private EducationalService: EducationalService,
    private TemplatesService: TemplatesService,
    private spinner: NgxSpinnerService
  ) {
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
      //  console.log("functionId", this.functionId);
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

  get stageIdCtrl() {
    return this.myForm.get("stageId");
  }

  get teacherUserIdCtrl() {
    return this.myForm.get("teacherUserId");
  }

  get educationYearIdCtrl() {
    return this.myForm.get("yearId");
  }

  get subjectIdCtrl() {
    return this.myForm.get("subjectId");
  }

  get unitIdCtrl() {
    return this.myForm.get("unitId");
  }

  get lessonIdCtrl() {
    return this.myForm.get("lessonId");
  }

  get topicIdCtrl() {
    return this.myForm.get("topicId");
  }

  get page() {
    return this.myForm.get("page");
  }

  ngOnInit() {
    this.EduCompId = this.authserv.getEduCompId();
    this.myForm = this.fb.group({
      teacherUserId: [""],
      yearId: [""],
      stageId: [""],
      subjectId: [""],
      unitId: [""],
      lessonId: [""],
      topicId: [""],
      page: [""],
    });
    this.getTeachersByEducompId();
    this.getTemplates(1);
    this.getTeachersByEducompId();

    this.stageIdCtrl.disable();
    this.educationYearIdCtrl.disable();
    this.subjectIdCtrl.disable();
    this.unitIdCtrl.disable();
    this.lessonIdCtrl.disable();
    this.topicIdCtrl.disable();
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getTemplates(1);
    });

    this.authserv.branchId.subscribe((e) => {
      //this.branchId = e.branchId;
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getTemplates(p: number) {
    this.spinner.show();
    this.page?.setValue(p);
    this.TemplatesService.getTemplates(
      this.EduCompId,
      p,
      this.myForm.value
    ).subscribe((res: any) => {
      //  console.log('getTemplates',res);
      this.Templates = res.result;
      this.dataSource = new MatTableDataSource(res.result);
      this.itemsCount = res.TotalItemCount;
      this.spinner.hide();
      this.spinner.hide();
    });
  }

  PublishDepublishTemplate(templateId: any) {
    this.spinner.show();
    this.TemplatesService.PublishDepublishTemplate(templateId).subscribe(
      (res: any) => {
        if (res.returnString == "Done") {
          for (const obj of this.Templates) {
            if (obj.Id === templateId) {
              obj.isPublish = !obj.isPublish;
              break;
            }
          }
        } else {
          this.toastr.error(res.returnString);
        }
        this.spinner.hide();
      }
    );
  }

  openDeleateDialog(template: TemplateVM): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: template.Name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.deleteTemplate(template);
      });
  }

  deleteTemplate(template: TemplateVM) {
    this.TemplatesService.deleteTemplate(template.Id).subscribe((res: any) => {
      let deletedIndex = this.Templates.findIndex((e) => e.Id == template.Id);
      this.Templates.splice(deletedIndex, 1);
      this.toastr.success(" Deleted");
      this.getTemplates(1);
    });
  }

  getTeachersByEducompId() {
    this.GeneralService.getTeachersByEducompId(this.EduCompId).subscribe(
      (res: any) => {
        this.Teachers = res.lstTeachers;

        //console.log("lst",this.Teachers);
      }
    );
    this.getStageByTeacherId();
  }

  getStageByTeacherId() {
    this.stageIdCtrl.setValue("");
    this.educationYearIdCtrl.setValue("");
    this.subjectIdCtrl.setValue("");
    this.unitIdCtrl.setValue("");
    this.lessonIdCtrl.setValue("");
    this.topicIdCtrl.setValue("");
    if (this.teacherUserIdCtrl.value != "") {
      console.log("teacher", this.teacherUserIdCtrl.value);
      this.EducationalService.getStageByTeacherId(
        this.teacherUserIdCtrl.value
      ).subscribe((res: any) => {
        console.log(res);
        this.stages = res;
        this.stageIdCtrl.enable();
        //console.log(res);
      });
    } else {
      this.stageIdCtrl.setValue("");
      this.stageIdCtrl.disable();
      this.educationYearIdCtrl.disable();
      this.subjectIdCtrl.disable();
      this.unitIdCtrl.disable();
      this.lessonIdCtrl.disable();
      this.topicIdCtrl.disable();
    }
  }

  returnYears() {
    this.educationYearIdCtrl.setValue("");
    this.subjectIdCtrl.setValue("");
    this.unitIdCtrl.setValue("");
    this.lessonIdCtrl.setValue("");
    this.topicIdCtrl.setValue("");
    if (this.stageIdCtrl.value != "") {
      this.EducationalService.returnYears(this.stageIdCtrl.value).subscribe(
        (res: any) => {
          console.log(res);
          this.years = res;
          this.educationYearIdCtrl.enable();
        }
      );
    } else {
      this.educationYearIdCtrl.setValue("");
      this.educationYearIdCtrl.disable();
      this.subjectIdCtrl.disable();
      this.unitIdCtrl.disable();
      this.lessonIdCtrl.disable();
      this.topicIdCtrl.disable();
    }
  }

  returnTeacherSubjects() {
    this.subjectIdCtrl.setValue("");
    this.unitIdCtrl.setValue("");
    this.lessonIdCtrl.setValue("");
    this.topicIdCtrl.setValue("");
    if (this.educationYearIdCtrl.value != "") {
      let data = {
        yearId: this.educationYearIdCtrl.value,
        teacherUserId: this.myForm.controls["teacherUserId"].value,
      };
      console.log(data);
      this.EducationalService.returnTeacherSubjects(data).subscribe(
        (res: any) => {
          console.log("subjects", res);
          this.subjects = res;
          this.subjectIdCtrl.enable();
        }
      );
    } else {
      this.subjectIdCtrl.setValue("");
      this.subjectIdCtrl.disable();
      this.unitIdCtrl.disable();
      this.lessonIdCtrl.disable();
      this.topicIdCtrl.disable();
    }
  }

  GetUnits() {
    this.unitIdCtrl.setValue("");
    this.lessonIdCtrl.setValue("");
    this.topicIdCtrl.setValue("");
    if (this.subjectIdCtrl.value != "") {
      this.EducationalService.GetUnits(this.subjectIdCtrl.value).subscribe(
        (res: any) => {
          console.log("unit", res);
          this.units = res;
          this.unitIdCtrl.enable();
        }
      );
    } else {
      this.unitIdCtrl.setValue("");
      this.unitIdCtrl.disable();
      this.lessonIdCtrl.disable();
      this.topicIdCtrl.disable();
    }
  }

  GetLessons() {
    this.lessonIdCtrl.setValue("");
    this.topicIdCtrl.setValue("");
    if (this.unitIdCtrl.value != "") {
      this.EducationalService.GetLessons(this.unitIdCtrl.value).subscribe(
        (res: any) => {
          console.log("lesson", res);
          this.lessons = res;
          this.lessonIdCtrl.enable();
        }
      );
    } else {
      this.lessonIdCtrl.setValue("");
      this.lessonIdCtrl.disable();
      this.topicIdCtrl.disable();
    }
  }

  GetTopics() {
    this.topicIdCtrl.setValue("");
    if (this.lessonIdCtrl.value != "") {
      this.EducationalService.GetTopics(this.lessonIdCtrl.value).subscribe(
        (res: any) => {
          console.log(res);
          this.topics = res;
          this.topicIdCtrl.enable();
        }
      );
    } else {
      this.topicIdCtrl.setValue("");
      this.topicIdCtrl.disable();
    }
  }
}
