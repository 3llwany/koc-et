import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormControl, FormBuilder } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { ISearchQuestion, question } from "app/admin/models/admin/exams";
import { EducationalService } from "app/admin/services/Admin/educational.service";
import { ExamsService } from "app/admin/services/Admin/exams.service";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import {
  GeneralDropdownVM,
  IRowFunctionVM,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-questions-index",
  templateUrl: "./questions-index.component.html",
  styleUrls: ["./questions-index.component.scss"],
})
export class QuestionsIndexComponent implements OnInit {
  EduCompId: any;
  branchId: any;
  itemsCount: number;
  myForm: FormGroup;
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  Teachers: teacherByEduCompId[];
  stages: GeneralDropdownVM[];
  years: GeneralDropdownVM[];
  subjects: GeneralDropdownVM[];
  units: GeneralDropdownVM[];
  lessons: GeneralDropdownVM[];
  topics: GeneralDropdownVM[];
  displayedColumns: string[] = [
    "#",
    "questionID",
    "questionText",
    "questionType",
    "subjectName",
    "unitName",
    "lessonName",
    "topicName",
    "mark",
    "levelName",
    "actions",
  ];
  dataSource: MatTableDataSource<question>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private authService: AuthService,
    private examServ: ExamsService,
    private GeneralService: GeneralService,
    private EducationalService: EducationalService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
      //  console.log("functionId", this.functionId);
      if (this.functionId) {
        this.authService
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
      teacherUserId: [null],
      stageId: [null],
      yearId: [null],
      subjectId: [null],
      unitId: [null],
      lessonId: [null],
      topicId: [null],
      questionString: [null],
    });
    this.EduCompId = this.authService.getEduCompId();
    this.branchId = this.authService.getBranchId();
    this.getTeachersByEducompId(this.EduCompId);
    this.getQuestions(1);
    // this.FormCtrl.stageId.disable();
    // this.FormCtrl.yearId.disable();
    // this.FormCtrl.subjectId.disable();
    // this.FormCtrl.unitId.disable();
    // this.FormCtrl.lessonId.disable();
    // this.FormCtrl.topicId.disable();
  }

  get FormCtrl() {
    return this.myForm.controls;
  }

  ngAfterViewInit() {
    this.authService.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getTeachersByEducompId(e.EduCompId);
      this.getQuestions(1);
    });

    this.authService.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getQuestions(page: any) {
    let obj = {} as ISearchQuestion;
    obj.teacherUserId = this.myForm.value.teacherUserId || null;
    obj.lessonId = this.myForm.value.lessonId || null;
    obj.questionString = this.myForm.value.questionString || null;
    obj.stageId = this.myForm.value.stageId || null;
    obj.subjectId = this.myForm.value.subjectId || null;
    obj.topicId = this.myForm.value.unitId || null;
    obj.unitId = this.myForm.value.questionString || null;
    obj.yearId = this.myForm.value.yearId || null;
    this.spinner.show();
    this.examServ
      .getQuestions(page, this.EduCompId, obj)
      .subscribe((res: any) => {
        this.dataSource = new MatTableDataSource(res.returnModel);
        this.itemsCount = res.itemsCount;
        this.spinner.hide();
      });
  }

  deleteQuestion(question: question) {
    this.spinner.show();

    this.examServ
      .deleteQuestion(this.EduCompId, question.questionID)
      .subscribe((res: any) => {
        if (res.returnValue == 1) {
          let i = this.dataSource.data.findIndex((e) => e === question);
          this.dataSource.data.splice(i, 1);
          this.dataSource.paginator = this.paginator;
          this.toastr.success("Done");
        }
        this.spinner.hide();
      });
  }

  openDeleateDialog(question: question): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: `${question.questionID} - ${question.questionTypeEnglishName}`,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.deleteQuestion(question);
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
    this.FormCtrl.unitId.setValue("");
    this.FormCtrl.lessonId.setValue("");
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
      this.FormCtrl.unitId.disable();
      this.FormCtrl.lessonId.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  getYearsByStageId(stageId: any) {
    this.FormCtrl.yearId.setValue("");
    this.FormCtrl.subjectId.setValue("");
    this.FormCtrl.unitId.setValue("");
    this.FormCtrl.lessonId.setValue("");
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
      this.FormCtrl.unitId.disable();
      this.FormCtrl.lessonId.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  //return Teacher Subjects   //{ "yearId" : 36, "teacherId" : 17}
  getSubjectsByYearId(yearId: any) {
    this.FormCtrl.subjectId.setValue("");
    this.FormCtrl.unitId.setValue("");
    this.FormCtrl.lessonId.setValue("");
    this.FormCtrl.topicId.setValue("");
    if (yearId != "") {
      let data = {
        yearId: yearId,
        teacherUserId: this.FormCtrl.teacherUserId?.value,
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
      this.FormCtrl.unitId.disable();
      this.FormCtrl.lessonId.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  getUnitsBySubjectId(SubjectId: any) {
    this.FormCtrl.unitId.setValue("");
    this.FormCtrl.lessonId.setValue("");
    this.FormCtrl.topicId.setValue("");
    if (SubjectId != "") {
      this.EducationalService.GetUnits(SubjectId).subscribe((res: any) => {
        this.units = res;
        this.FormCtrl.unitId.enable();
      });
    } else {
      this.FormCtrl.unitId.setValue("");
      this.FormCtrl.unitId.disable();
      this.FormCtrl.lessonId.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  getLessonsByUnitId(unitId: any) {
    this.FormCtrl.lessonId.setValue("");
    this.FormCtrl.topicId.setValue("");
    if (unitId != "") {
      this.EducationalService.GetLessons(unitId).subscribe((res: any) => {
        this.lessons = res;
        this.FormCtrl.lessonId.enable();
      });
    } else {
      this.FormCtrl.lessonId.setValue("");
      this.FormCtrl.lessonId.disable();
      this.FormCtrl.topicId.disable();
    }
  }

  GetTopicsByLessonId(LessonId: any) {
    this.FormCtrl.topicId.setValue("");
    if (this.FormCtrl.lessonId.value) {
      this.EducationalService.GetTopics(LessonId).subscribe((res: any) => {
        this.topics = res;
        this.FormCtrl.topicId.enable();
      });
    } else {
      this.FormCtrl.topicId.setValue("");
      this.FormCtrl.topicId.disable();
    }
  }

  resetManual() {
    this.myForm.controls["teacherUserId"].setValue("");
    this.myForm.controls["yearId"].setValue("");
    this.myForm.controls["stageId"].setValue("");
    this.myForm.controls["subjectId"].setValue("");
    this.myForm.controls["unitId"].setValue("");
    this.myForm.controls["lessonId"].setValue("");
    this.myForm.controls["topicId"].setValue("");
  }
}
