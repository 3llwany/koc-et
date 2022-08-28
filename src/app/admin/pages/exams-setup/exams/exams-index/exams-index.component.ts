import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ExamsService } from "app/admin/services/Admin/exams.service";

import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import { MatTableDataSource } from "@angular/material/table";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import {
  IExamViewModel,
  ICountrieDropModel,
  IStageDropModel,
  IEducationYearDropModel,
  ISubjectDropModel,
  ITeacherDropModel,
} from "app/admin/models/admin/exam";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { IRowFunctionVM } from "app/shared/models/general/general";

@Component({
  selector: "app-exams-index",
  templateUrl: "./exams-index.component.html",
  styleUrls: ["./exams-index.component.scss"],
})
export class ExamsIndexComponent implements OnInit {
  totalItems: any;
  EduCompId: any;
  branchId: any;
  exams: IExamViewModel[] = [];
  countries: ICountrieDropModel[] = [];
  stages: IStageDropModel[] = [];
  educationYears: IEducationYearDropModel[] = [];
  subjects: ISubjectDropModel[] = [];
  teachers: ITeacherDropModel[] = [];

  displayedColumns: string[] = [
    "#",
    "name",
    "subject",
    "year",
    "teacher",
    "publish",
    "actions",
  ];
  dataSource: MatTableDataSource<IExamViewModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  myForm!: FormGroup;
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public authserv: AuthService,
    private examService: ExamsService,
    private msg: ToastrService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
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

  ngOnInit(): void {
    this.EduCompId = this.authserv.getEduCompId();
    this.branchId = this.authserv.getBranchId();

    this.myForm = this.fb.group({
      countryId: [""],
      stageId: [""],
      educationYearId: [""],
      subjectId: ["0"],
      teacherUserId: ["0"],
      page: [""],
      EduCompId: [this.EduCompId],
    });

    //  this.stageIdCtrl?.disable();
    //  this.educationYearIdCtrl?.disable();
    //  this.subjectIdCtrl?.disable();
    //this.teacherIdCtrl?.disable();

    this.getAllCountieres();
    this.getAllExams(1);
  }

  get countryIdCtrl() {
    return this.myForm.get("countryId");
  }

  get stageIdCtrl() {
    return this.myForm.get("stageId");
  }

  get educationYearIdCtrl() {
    return this.myForm.get("educationYearId");
  }

  get subjectIdCtrl() {
    return this.myForm.get("subjectId");
  }

  get teacherUserIdCtrl() {
    return this.myForm.get("teacherUserId");
  }

  get page() {
    return this.myForm.get("page");
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getAllExams(1);
    });

    this.authserv.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllExams(p: number) {
    this.page?.setValue(p);
    this.myForm.controls["EduCompId"].setValue(this.EduCompId);
    let data = {
      subjectId: this.subjectIdCtrl?.value,
      teacherUserId: this.teacherUserIdCtrl?.value,
      page: p,
      EduCompId: this.EduCompId,
    };
    // console.log(data);
    this.spinner.show();
    this.examService.getAllNormalExams(data).subscribe((response: any) => {
      if (response) {
        //  console.log('EXAMS: ', response);
        this.dataSource = new MatTableDataSource(response.examList.reverse());
        this.exams = response.examList;
        this.totalItems = response.totalCount;
      }
      this.spinner.hide();
    });
  }

  removeExam(exam: IExamViewModel) {
    this.examService.deleteExam<any>(exam.Id).subscribe((response) => {
      if (response) {
        //  console.log('deleted: ', response);
        let deletedIndex = this.exams.findIndex((e) => e.Id == exam.Id);
        this.exams.splice(deletedIndex, 1);
        this.msg.success("تم حذف الإمتحان");
      }
    });
  }

  openDeleateDialog(exam: IExamViewModel): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: exam.Name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.removeExam(exam);
      });
  }

  onPublishExam(exam: IExamViewModel) {
    this.examService.publishExam<any>(exam.Id).subscribe((response) => {
      if (response) {
        //  console.log('published: ', response);
        for (const obj of this.exams) {
          if (obj.Id === exam.Id) {
            obj.IsPublish = !obj.IsPublish;
            break;
          }
        }
        this.msg.success("Done");
      }
    });
  }

  getAllCountieres() {
    this.examService
      .getAllCountries<ICountrieDropModel[]>()
      .subscribe((response) => {
        if (response) {
          //console.log("COUNTIRES: ", response);
          this.countries = response;
        }
      });
  }

  onSelectCountry() {
    this.stageIdCtrl?.setValue("");
    this.educationYearIdCtrl?.setValue("");
    this.subjectIdCtrl?.setValue("");
    this.teacherUserIdCtrl?.setValue("");
    if (this.countryIdCtrl?.value) {
      //  console.log('SELECTED country: ', this.countryIdCtrl?.value);
      this.examService
        .getAllStages<IStageDropModel[]>(this.countryIdCtrl?.value)
        .subscribe((response) => {
          if (response) {
            this.stages = response;
            //console.log("STAGES:", response);
            this.stageIdCtrl?.enable();
          }
        });
    } else {
      this.stageIdCtrl?.disable();
      this.educationYearIdCtrl?.disable();
      this.subjectIdCtrl?.disable();
      this.teacherUserIdCtrl?.disable();
    }
  }

  onSelectStages() {
    this.educationYearIdCtrl?.setValue("");
    this.subjectIdCtrl?.setValue("");
    this.teacherUserIdCtrl?.setValue("");
    if (this.stageIdCtrl?.value) {
      //console.log("SELECTED stages: ", this.stageIdCtrl?.value);
      this.examService
        .getAllEducationYears<IEducationYearDropModel[]>(
          this.stageIdCtrl?.value
        )
        .subscribe((response) => {
          if (response) {
            this.educationYears = response;
            //console.log("YEARS:", response);
            this.educationYearIdCtrl?.enable();
          }
        });
    } else {
      this.educationYearIdCtrl?.disable();
      this.subjectIdCtrl?.disable();
      this.teacherUserIdCtrl?.disable();
    }
  }

  onSelectEducationYears() {
    this.subjectIdCtrl?.setValue("");
    this.teacherUserIdCtrl?.setValue("");
    if (this.educationYearIdCtrl?.value) {
      //console.log("SELECTED YEARS: ", this.stageIdCtrl?.value);
      this.examService
        .getAllSubjects<ISubjectDropModel[]>(this.educationYearIdCtrl?.value)
        .subscribe((response) => {
          if (response) {
            this.subjects = response;
            //console.log("SUBJECTS:", response);
            this.subjectIdCtrl?.enable();
          }
        });
    } else {
      this.subjectIdCtrl?.disable();
      this.teacherUserIdCtrl?.disable();
    }
  }

  onSelectSubjects() {
    this.teacherUserIdCtrl?.setValue("");
    if (this.subjectIdCtrl?.value) {
      //console.log("SELECTED subject: ", this.stageIdCtrl?.value);
      this.examService
        .getAllTeachersBySublectId<ITeacherDropModel[]>(
          this.subjectIdCtrl?.value
        )
        .subscribe((response) => {
          if (response) {
            this.teachers = response;
            //console.log("teachers:", response);
            this.teacherUserIdCtrl?.enable();
          }
        });
    } else {
      this.teacherUserIdCtrl?.disable();
    }
  }
  track(index: number, el: any): number {
    return el.Id;
  }
}
