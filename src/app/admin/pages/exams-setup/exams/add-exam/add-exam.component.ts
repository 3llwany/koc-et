import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import {
  IExamResponse,
  IExamResponseInDetails,
} from "../../../../models/admin/addEditExam";
import { Location } from "@angular/common";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { AuthService } from "../../../../../shared/services/auth/auth.service";
import { ExamsService } from "../../../../services/Admin/exams.service";
import { MatTableDataSource } from "@angular/material/table";
import {
  ICountrieDropModel,
  IDiscountTypeModel,
  IEducationYearDropModel,
  IExamTypeModel,
  ILessionModel,
  IStageDropModel,
  ISubjectDropModel,
  ITeacherDropModel,
  IUnitModel,
} from "../../../../models/admin/exam";
import {
  IAddEditExamHeaderModel,
  IAddEditExamModel,
} from "../../../../models/admin/addEditExam";
import { forkJoin, Observable } from "rxjs";
import {
  IAddExamGroupHeaderModel,
  IEditExamGroupHeaderModel,
  IExamGroupHeaderModel,
  IExamModel,
} from "../../../../models/admin/AddExamGroupHeader";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import {
  IRowFunctionVM,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { AddSubQuestionComponent } from "../add-sub-question/add-sub-question.component";
import { GeneralService } from "app/shared/services/General/general.service";
import { QuillEditorComponent } from "ngx-quill";
import { map, startWith } from "rxjs/operators";

@Component({
  selector: "app-add-exam",
  templateUrl: "./add-exam.component.html",
  styleUrls: ["./add-exam.component.scss"],
})
export class AddExamComponent implements OnInit {
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  EduCompId: any;
  branchId: any;
  countries: ICountrieDropModel[] = [];
  stages: IStageDropModel[] = [];
  educationYears: IEducationYearDropModel[] = [];
  subjects: ISubjectDropModel[] = [];
  teachers: teacherByEduCompId[];
  examTypes: IExamTypeModel[] = [];

  units: IUnitModel[] = [];
  lessions: ILessionModel[] = [];
  discountTypes: IDiscountTypeModel[] = [];

  examGroups: any[] = [];
  examHeaders: any[] = [];
  filteredExamGroups: Observable<any[]>;
  filteredExamHeaders: Observable<any[]>;

  GroupsHeadersList: IExamGroupHeaderModel[] = [];

  examGroupHeaderIdToEdit: number = 0;
  exam_ar_name: string;
  myForm!: FormGroup;
  displayedColumns: string[] = [
    "#",
    "questionNumber",
    "questionType",
    "question_title",
    "actions",
  ];
  dataSource: MatTableDataSource<IExamGroupHeaderModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  GroupHeadersForm!: FormGroup;
  submitted = false;
  itemsCount: any;
  GroupHeadsubmitted = false;
  examId: number = 0;
  editGroupHeaderMode: boolean = false;
  isRepeatableExam: boolean = false;
  isSendWhats: boolean = false;
  examGroupHeaderId: any = 0;

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
  get examTypeIdCtrl() {
    return this.myForm.get("examTypeId");
  }
  get unitIdCtrl() {
    return this.myForm.get("unitId");
  }
  get lessionIdCtrl() {
    return this.myForm.get("lessionId");
  }
  get examNameCtrl() {
    return this.myForm.get("examName");
  }
  get examHoursCtrl() {
    return this.myForm.get("examHours");
  }
  get examMinutesCtrl() {
    return this.myForm.get("examMinutes");
  }
  get examPriceCtrl() {
    return this.myForm.get("examPrice");
  }
  get discountCtrl() {
    return this.myForm.get("discount");
  }
  get discountTypeCtrl() {
    return this.myForm.get("discountType");
  }
  get fromDateCtrl() {
    return this.myForm.get("fromDate");
  }
  get toDateCtrl() {
    return this.myForm.get("toDate");
  }
  get formHourCtrl() {
    return this.myForm.get("formHour");
  }
  get toHoursCtrl() {
    return this.myForm.get("toHours");
  }
  get resualtDateCtrl() {
    return this.myForm.get("resualtDate");
  }
  get resualtTimeCtrl() {
    return this.myForm.get("resualtTime");
  }
  get canSellIndividuallyCtrl() {
    return this.myForm.get("canSellIndividually");
  }
  get isRepeatableCtrl() {
    return this.myForm.get("isRepeatable");
  }
  get repeatNumbersCtrl() {
    return this.myForm.get("repeatNumbers");
  }
  get repeatingPriceCtrl() {
    return this.myForm.get("repeatingPrice");
  }
  get hasCustomDiscountCtrl() {
    return this.myForm.get("hasCustomDiscount");
  }
  get sendWhatsAppMsgCtrl() {
    return this.myForm.get("sendWhatsAppMsg");
  }
  get examGroupCtrl() {
    return this.GroupHeadersForm.get("examGroup");
  }
  get examHeaderCtrl() {
    return this.GroupHeadersForm.get("examHeader");
  }
  get examContentCtrl() {
    return this.GroupHeadersForm.get("examContent");
  }
  get isPublishCtrl() {
    return this.myForm.get("isPublish");
  }

  constructor(
    public location: Location,
    private fb: FormBuilder,
    public authserv: AuthService,
    private examService: ExamsService,
    // private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private msg: ToastrService,
    private generalService: GeneralService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.examId = Number(params.get("examId"));
      if (this.examId > 0) {
        this.getExamById();
        this.getAllGroupHeaderByExamId();
      }

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
    this.myForm = this.fb.group({
      countryId: [""],
      stageId: [""],
      educationYearId: [""],
      subjectId: ["", [Validators.required]],
      teacherUserId: ["", [Validators.required]],
      examTypeId: ["", [Validators.required]],
      unitId: [""],
      lessionId: [""],
      examName: ["", [Validators.required, CustomeValidator.whiteSpace]],
      examHours: ["", [Validators.required, CustomeValidator.minusNum]],
      examMinutes: ["", [Validators.required, CustomeValidator.minusNum]],
      examPrice: [0, [Validators.required, CustomeValidator.minusNum]],
      discount: [""],
      discountType: [""],
      fromDate: [""],
      toDate: [""],
      formHour: [""],
      toHours: [""],
      resualtDate: [""],
      resualtTime: [""],
      canSellIndividually: [true, Validators.required],
      isRepeatable: [false, Validators.required],
      repeatNumbers: [""],
      repeatingPrice: [0],
      hasCustomDiscount: [false, Validators.required],
      sendWhatsAppMsg: [false, Validators.required],
      isPublish: [0],
    });

    this.GroupHeadersForm = this.fb.group({
      examGroup: ["", Validators.required],
      examHeader: ["", Validators.required],
      examContent: [""],
    });

    this.EduCompId = this.authserv.getEduCompId();
    this.branchId = this.authserv.getBranchId();

    this.stageIdCtrl?.disable();
    this.educationYearIdCtrl?.disable();
    this.subjectIdCtrl?.disable();
    this.teacherUserIdCtrl?.disable();
    this.unitIdCtrl?.disable();
    this.lessionIdCtrl?.disable();

    this.getAllCountieres();
    this.getAllExamTypes();
    this.getAllQuestionGroups();
    this.getAllQuestionHeaders();

    this.examTypeValidator();
    this.RepeatableValidator();
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
    });

    this.authserv.branchId.subscribe((e) => {
      this.branchId = e.branchId;
    });

    // if (this.examId > 0) this.getExamById();

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  // filter question group
  private filter_question_group(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.examGroups.filter((option) =>
      option.question_group_ar_name.toLowerCase().includes(filterValue)
    );
  }

  // filter question header
  private filter_question_header(value: string): any[] {
    const filterValue = value.toLowerCase();
    return this.examHeaders.filter((option) =>
      option.question_head_ar_name.toLowerCase().includes(filterValue)
    );
  }

  getExamById() {
    this.spinner.show();
    this.examService
      .getExamById<IExamResponseInDetails>(this.examId)
      .subscribe((response) => {
        // console.log("getExamById", response);
        if (response) {
          this.stageIdCtrl?.enable();
          this.educationYearIdCtrl?.enable();
          this.subjectIdCtrl?.enable();
          this.teacherUserIdCtrl?.enable();
          this.unitIdCtrl?.enable();
          this.lessionIdCtrl?.enable();

          this.toHoursCtrl?.setValue(response?.toHour);
          this.isPublishCtrl?.setValue(response?.isPublish);
          this.discountCtrl?.setValue(response?.Discount);
          this.examNameCtrl?.setValue(response?.exam_ar_name);
          this.exam_ar_name = response?.exam_ar_name;
          this.formHourCtrl?.setValue(response?.fromHour);
          this.examPriceCtrl?.setValue(response?.price);
          this.resualtTimeCtrl?.setValue(response?.ResultTime);
          this.discountTypeCtrl?.setValue(response?.DiscountType);
          this.isRepeatableCtrl?.setValue(response?.repeatableExam);
          this.isRepeatableExam = response?.repeatableExam;
          this.repeatNumbersCtrl?.setValue(response?.repeatableExam_Count);
          this.sendWhatsAppMsgCtrl?.setValue(response?.SendWhatsApp);
          this.isSendWhats = response?.SendWhatsApp;
          this.hasCustomDiscountCtrl?.setValue(response?.Discount > 0);
          this.canSellIndividuallyCtrl?.setValue(
            response?.Individually_Purchased
          );
          this.countryIdCtrl?.setValue(response.countryId);
          // this.examTypeIdCtrl?.setValue(response.examTypeId);
          this.repeatingPriceCtrl?.setValue(response.StudentRepeatExamCost);

          let exam_minute = response.exam_period_minute % 60;
          let exam_hour = (response.exam_period_minute - exam_minute) / 60;
          this.examMinutesCtrl?.setValue(exam_minute);
          this.examHoursCtrl?.setValue(exam_hour);

          if (response.Lesson_ID != null) this.examTypeIdCtrl?.setValue(1);
          if (response?.Unit_ID != null && response.Lesson_ID == null)
            this.examTypeIdCtrl?.setValue(2);

          if (
            response?.Subject_ID != null &&
            response?.Unit_ID == null &&
            response.Lesson_ID == null
          )
            this.examTypeIdCtrl?.setValue(3);

          if (
            response?.Subject_ID == null &&
            response?.Unit_ID == null &&
            response.Lesson_ID == null
          )
            this.examTypeIdCtrl?.setValue(4);

          this.fromDateCtrl?.setValue(response.Avilable_Date_From);
          this.toDateCtrl?.setValue(response.Avilable_Date_To);
          this.resualtDateCtrl?.setValue(response.ResultDate);

          this.countryIdCtrl?.setValue(1);
          this.onSelectCountry();
          this.stageIdCtrl?.setValue(response.stageId);
          this.onSelectStages();
          this.educationYearIdCtrl?.setValue(response.eduYearId);
          this.onSelectEducationYears();
          this.subjectIdCtrl?.setValue(response?.Subject_ID);
          this.onSelectSubjects();
          this.teacherUserIdCtrl?.setValue(response?.teacherUserId);
          this.unitIdCtrl?.setValue(response?.Unit_ID);

          this.onSelectUnit();
          this.lessionIdCtrl?.setValue(response?.Lesson_ID);

          this.stageIdCtrl?.setValue(response.stageId);
          this.educationYearIdCtrl?.setValue(response.eduYearId);
          this.subjectIdCtrl?.setValue(response?.Subject_ID);
          this.teacherUserIdCtrl?.setValue(response?.teacherUserId);
          this.unitIdCtrl?.setValue(response?.Unit_ID);
        }
        this.spinner.hide();
      });
  }

  getAllGroupHeaderByExamId() {
    this.examService
      .getAllGroupHeaderByExamId<IExamGroupHeaderModel>(this.examId)
      .subscribe((response) => {
        if (response) {
          //  console.log("groupsHeadersLit : ", response);
          this.GroupsHeadersList = response;
          this.dataSource = new MatTableDataSource(response);
          this.itemsCount = response.length;
        }
      });
  }

  getAllQuestionGroups() {
    this.examService.getAllQuestionGroups<any>().subscribe((response) => {
      if (response) {
        this.examGroups = response;
        //  console.log("examGroups", this.examGroups);
        this.filteredExamGroups = this.examGroupCtrl.valueChanges.pipe(
          startWith(""),
          map((value) => this.filter_question_group(value || ""))
        );
      }
    });
  }

  getAllQuestionHeaders() {
    this.examService.getAllQuestionHeaders<any>().subscribe((response) => {
      if (response) {
        this.examHeaders = response;
        this.filteredExamHeaders = this.examHeaderCtrl.valueChanges.pipe(
          startWith(""),
          map((value) => this.filter_question_header(value || ""))
        );
      }
    });
  }

  onSubmit() {
    // todo .. check for mandatory firlds

    let exam: IAddEditExamModel = {
      id: this.examId,
      Avilable_Date_From: this.fromDateCtrl?.value,
      Avilable_Date_To: this.toDateCtrl?.value,
      CustomDiscountApplied: this.hasCustomDiscountCtrl?.value,
      Discount: this.discountCtrl?.value,
      DiscountType: this.discountTypeCtrl?.value,
      EduCompId: this.EduCompId,
      Individually_Purchased: this.canSellIndividuallyCtrl?.value,
      ResultDate: this.resualtDateCtrl?.value,
      ResultTime: this.resualtTimeCtrl?.value,
      SendWhatsApp: this.sendWhatsAppMsgCtrl?.value,
      StudentRepeatExamCost: this.repeatingPriceCtrl?.value,
      exam_ar_name: this.examNameCtrl?.value,
      fromHour: this.formHourCtrl?.value,
      lesson_ID: this.lessionIdCtrl?.value,
      price: this.examPriceCtrl?.value,
      repeatableExam: this.isRepeatableCtrl?.value,
      repeatableExam_Count: this.repeatNumbersCtrl?.value,
      subject_ID: this.subjectIdCtrl?.value,
      teacherUserId: this.teacherUserIdCtrl?.value,
      teacher_subject_id: this.subjectIdCtrl?.value,
      toHour: this.toHoursCtrl?.value,
      unit_ID: this.unitIdCtrl?.value,
      exam_hour: this.examHoursCtrl?.value,
      exam_minute: this.examMinutesCtrl?.value,
      isPublish: this.isPublishCtrl?.value,
    };

    let toAddEdit: IAddEditExamHeaderModel = {
      exam_hour: this.examHoursCtrl?.value,
      exam_minute: this.examMinutesCtrl?.value,
      exam_type_id: this.examTypeIdCtrl?.value,
      exam: exam,
    };

    // console.log("toAdd ", toAddEdit);

    // if exam id = 0 the end point will add >> if the exam id > 0 the end point will edit
    this.addExam(toAddEdit);
  }

  addExam(toAddEdit: IAddEditExamHeaderModel) {
    let validGroupHeadersForm = this.GroupHeadersForm.valid;
    this.submitted = true;
    if (this.examId == 0 && !validGroupHeadersForm) {
      this.GroupHeadsubmitted = true;
    } else {
      if (
        this.hasCustomDiscountCtrl?.value == true &&
        this.repeatNumbersCtrl.value <= 0
      ) {
        this.msg.warning("يجب ادخال عدد مرات التكرار");
        return;
      }

      if (
        this.hasCustomDiscountCtrl?.value == true &&
        this.repeatingPriceCtrl.value < 0
      ) {
        this.msg.warning("يجب ادخال سعر تجديد الامتحان ");
        return;
      }
      if (this.myForm.valid) {
        this.spinner.show();
        this.examService
          .addExam<IAddEditExamHeaderModel, any>(toAddEdit)
          .subscribe((response) => {
            //  console.log('addExam', response);
            if (response.returnValue == 200 && response.examId > 0) {
              //  console.log("addExam", response);
              this.examId = response.examId;
              this.router.navigate([], {
                queryParams: {
                  examId: response.examId,
                },
                queryParamsHandling: "merge",
              });
              this.onAddExamGroupHeader();

              this.msg.success("تم اضافة/ تعديل الامتحان بنجاح");
              this.submitted = false;
            }
            this.spinner.hide();
          });
      } else this.msg.error("Check your inputs");
    }
  }

  onAddExamGroupHeader() {
    // let sameGroupWithSameHeader = this.GroupsHeadersList.find(
    //   (gh) =>
    //     gh.group_name == this.examGroupCtrl?.value &&
    //     gh.head_name == this.examHeaderCtrl?.value
    // );
    let sameGroupWithSameHeader = this.dataSource?.data?.find(
      (gh) =>
        gh.group_name == this.examGroupCtrl?.value &&
        gh.head_name == this.examHeaderCtrl?.value
    );

    if (sameGroupWithSameHeader) {
      this.msg.info("Cannot add the same header with same group");
      return;
    }

    let tempExam: IExamModel = {
      id: this.examId,
    };

    let ToAddExamGroupHeader: IAddExamGroupHeaderModel = {
      exam_question_group_text: this.examGroupCtrl?.value,
      exam_question_head_title: this.examContentCtrl?.value,
      exam_question_head_text: this.examHeaderCtrl?.value,
      exam: tempExam,
    };

    if (this.GroupHeadersForm.valid) {
      this.spinner.show();
      this.examService
        .addExamGroupHeader<IAddExamGroupHeaderModel, any>(ToAddExamGroupHeader)
        .subscribe((headerResponse) => {
          if (headerResponse) {
            //  console.log('addExamGroupHeader', headerResponse);
            this.getAllGroupHeaderByExamId();
            this.msg.success("تم الإضافة");
            let tempExcamGroupHeader = {
              Id: headerResponse.exam_question_head_id,
              group_name: this.examGroupCtrl?.value,
              head_name: this.examHeaderCtrl?.value,
              question_title: this.examContentCtrl?.value,
            };

            //   this.GroupsHeadersList.push(tempExcamGroupHeader);

            // console.log("this.GroupsHeadersList", this.GroupsHeadersList);

            this.examContentCtrl?.setValue(null);
            this.spinner.hide();
          }
        });
    } else {
      if (this.examId == 0) this.msg.error("Check your inputs");
    }
  }

  getExamHeadById(examGroupHeader: IExamGroupHeaderModel) {
    this.editGroupHeaderMode = true;
    this.examGroupHeaderIdToEdit = examGroupHeader.id;
    this.examGroupCtrl?.setValue(examGroupHeader?.questionNumber);
    this.examContentCtrl?.setValue(examGroupHeader?.question_title);
    this.examHeaderCtrl?.setValue(examGroupHeader?.questionType);
  }

  editExamGroupHead() {
    let toEdit: IEditExamGroupHeaderModel = {
      exam_question_head_id: this.examGroupHeaderIdToEdit,
      group: this.examGroupCtrl?.value,
      head: this.examHeaderCtrl?.value,
      title: this.examContentCtrl?.value,
    };

    // console.log('toEdit', toEdit);
    this.spinner.show();
    this.examService
      .editExamGroupHeader<IEditExamGroupHeaderModel, any>(toEdit)
      .subscribe((editResponse) => {
        if (editResponse) {
          //   console.log('editResponse', editResponse);

          let toReplace = this.dataSource.data.find(
            (gh) => gh.id == this.examGroupHeaderIdToEdit
          );

          if (toReplace) {
            toReplace.questionNumber = toEdit.group;
            toReplace.questionType = toEdit.head;
            toReplace.question_title = this.examContentCtrl?.value;
          }

          this.editGroupHeaderMode = false;
          this.examContentCtrl?.setValue(null);
          this.msg.success("تم التعديل بنجاح");
        }
        this.spinner.hide();
      });
  }

  removeExamGroupHead(examGroupHeader: IExamGroupHeaderModel) {
    this.spinner.show();
    this.examService
      .deleteExamGroupHeader(examGroupHeader.id)
      .subscribe((deleteResponse: any) => {
        // console.log('deleteResponse', deleteResponse);
        if (deleteResponse.returnValue == 200) {
          let todeleteIndex = this.dataSource.data.findIndex(
            (gh) => gh == examGroupHeader
          );

          this.dataSource.data.splice(todeleteIndex, 1);
          this.dataSource.paginator = this.paginator;
          this.msg.success("تم الحذف");
        } else this.msg.error(deleteResponse.returnString);
        this.spinner.hide();
      });
  }

  openDeleateDialog(examGroupHeader: IExamGroupHeaderModel): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: examGroupHeader.questionNumber,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.removeExamGroupHead(examGroupHeader);
      });
  }

  addSubQuestionDialog(groupHeader: IExamGroupHeaderModel): void {
    this.dialog
      .open(AddSubQuestionComponent, {
        data: {
          examId: this.examId,
          examGroupHeaderId: groupHeader.id,
          subjectId: this.subjectIdCtrl.value,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) {
        }
      });
  }

  addSubQuestion(examGroupHeaderId: number) {
    this.examGroupHeaderId = examGroupHeaderId;
    let obj: any = {
      examGroupHeaderId: examGroupHeaderId,
      subjectId: this.subjectIdCtrl?.value,
      unitId: this.unitIdCtrl?.value,
      lessonId: this.lessionIdCtrl?.value,
    };
  }

  getAllExamTypes() {
    this.examService
      .getAllExamType<IExamTypeModel[]>()
      .subscribe((response) => {
        if (response) {
          this.examTypes = response;
        }
      });
  }

  onSelectExamType() {
    //  console.log('exam type: ', this.examTypeIdCtrl?.value);

    if (this.examTypeIdCtrl?.value == 1) {
      this.unitIdCtrl?.enable();
      this.lessionIdCtrl?.enable();
    } else if (this.examTypeIdCtrl?.value == 2) {
      this.unitIdCtrl?.enable();
      this.lessionIdCtrl?.disable();
    } else {
      this.unitIdCtrl?.disable();
      this.lessionIdCtrl?.disable();
    }
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
    // this.stageIdCtrl?.setValue("");
    // this.educationYearIdCtrl?.setValue("");
    // this.subjectIdCtrl?.setValue("");
    // this.teacherUserIdCtrl?.setValue("");
    if (this.countryIdCtrl?.value) {
      //   console.log('SELECTED country: ', this.countryIdCtrl?.value);
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
    // console.log('onSelectStages: ', this.stageIdCtrl?.value);
    this.educationYearIdCtrl?.setValue("");
    this.subjectIdCtrl?.setValue("");
    this.teacherUserIdCtrl?.setValue("");
    if (this.stageIdCtrl?.value) {
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
    //   console.log('onSelectEducationYears: ', this.educationYearIdCtrl?.value);
    this.subjectIdCtrl?.setValue("");
    this.teacherUserIdCtrl?.setValue("");
    if (this.educationYearIdCtrl?.value) {
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
    // console.log('onSelectSubjects: ', this.subjectIdCtrl?.value);
    //   this.teacherUserIdCtrl?.setValue("");
    if (this.subjectIdCtrl?.value) {
      forkJoin([
        this.generalService.getTeacherBySubjectAndEduCompId(
          this.EduCompId,
          this.subjectIdCtrl?.value
        ),
        this.examService.getAllUnitsBySublectId<any[]>(
          this.subjectIdCtrl?.value
        ),
      ]).subscribe((results: any) => {
        this.teachers = results[0].teachers;
        this.units = results[1];
        this.teacherUserIdCtrl?.enable();
      });
    } else {
      this.teacherUserIdCtrl?.disable();
    }
  }

  onSelectUnit() {
    if (this.unitIdCtrl?.value != null) {
      this.examService
        .getAllLessonsByUnitId<any>(this.unitIdCtrl?.value)
        .subscribe((response) => {
          if (response) {
            this.lessions = response;
          }
        });
    }
  }

  examTypeValidator() {
    let examTypeId = this.examTypeIdCtrl?.value;
    if (examTypeId == 1) {
      this.unitIdCtrl?.setValidators([Validators.required]);
      this.lessionIdCtrl?.setValidators([Validators.required]);
    } else if (examTypeId == 2) {
      this.unitIdCtrl?.setValidators([Validators.required]);
      this.lessionIdCtrl?.clearValidators();
      this.lessionIdCtrl?.reset();
    } else {
      this.unitIdCtrl?.clearValidators();
      this.unitIdCtrl?.reset();
      this.lessionIdCtrl?.clearValidators();
      this.lessionIdCtrl?.reset();
    }
    this.unitIdCtrl?.updateValueAndValidity();
    this.lessionIdCtrl?.updateValueAndValidity();
  }

  RepeatableValidator() {
    let CustomDiscount = this.hasCustomDiscountCtrl?.value;
    if (CustomDiscount == true) {
      this.repeatNumbersCtrl?.setValidators([Validators.required]);
      this.repeatingPriceCtrl?.setValidators([Validators.required]);
    } else if (CustomDiscount == false) {
      this.repeatNumbersCtrl?.clearValidators();
      this.repeatingPriceCtrl?.clearValidators();
      this.repeatNumbersCtrl?.reset();
      this.repeatingPriceCtrl?.reset();
    }
    this.repeatNumbersCtrl?.updateValueAndValidity();
    this.repeatingPriceCtrl?.updateValueAndValidity();
  }
}
