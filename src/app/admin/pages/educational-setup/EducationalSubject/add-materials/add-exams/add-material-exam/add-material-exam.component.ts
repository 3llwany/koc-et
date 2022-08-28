import { NgxSpinnerService } from "ngx-spinner";
import {
  IExamVM,
  IGetMatAttachedQuizVM,
} from "./../../../../../../models/admin/exams";
import { AuthService } from "./../../../../../../../shared/services/auth/auth.service";
import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import { ToastrService } from "ngx-toastr";
import { ITemplateVM } from "app/admin/models/admin/exams";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
  selector: "app-add-material-exam",
  templateUrl: "./add-material-exam.component.html",
  styleUrls: ["./add-material-exam.component.scss"],
})
export class AddMaterialExamComponent implements OnInit {
  @Input("materialId") materialId: any;
  subjectId: any;
  EduCompId: any;
  exams: IExamVM[] = [];
  templates: ITemplateVM[] = [];
  myForm!: FormGroup;
  AttachedQuiz: IGetMatAttachedQuizVM[];
  submitted = false;
  noExamerr = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private AuthService: AuthService,
    private SubjectMaterialsService: SubjectMaterialsService,
    private dialog: MatDialog
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.subjectId = params.get("subjectId");
    });
  }

  ngOnInit(): void {
    this.EduCompId = this.AuthService.getEduCompId();

    this.myForm = this.fb.group({
      materialId: [this.materialId, Validators.required],
      examId: [null],
      templateId: [null],
      percentageToPass: ["", [Validators.required, CustomeValidator.minusNum]],
    });

    if (this.materialId != null || this.materialId != undefined) {
      this.FormCtrl.materialId?.setValue(this.materialId);
      this.getExamsAndTemplates();
      this.getMaterialQuizes();
    }
  }

  ngOnChanges(): void {
    if (this.materialId != null || this.materialId != undefined) {
      this.FormCtrl.materialId?.setValue(this.materialId);
      this.getExamsAndTemplates();
      this.getMaterialQuizes();
    }
  }

  get FormCtrl() {
    return this.myForm.controls;
  }

  getExamsAndTemplates() {
    this.spinner.show();
    this.SubjectMaterialsService.getExamsAndTemplates(
      this.EduCompId,
      this.subjectId,
      this.materialId
    ).subscribe((res: any) => {
      this.exams = res.examsList;
      this.templates = res.templatesList;
      this.spinner.hide();
    });
  }

  getMaterialQuizes() {
    this.spinner.show();
    this.SubjectMaterialsService.getMaterialQuizes<IGetMatAttachedQuizVM[]>(
      this.materialId
    ).subscribe((res) => {
      console.log(res);
      this.AttachedQuiz = res;
      this.spinner.hide();
    });
  }

  addMaterialQuiz() {
    this.submitted = true;
    if (!this.FormCtrl.examId.value && !this.FormCtrl.templateId.value) {
      this.toastr.warning("Must Choose Exam or Template");
      return;
    }
    if (this.myForm.valid) {
      this.spinner.show();
      this.SubjectMaterialsService.addMaterialQuiz(
        this.materialId,
        this.myForm.value
      ).subscribe((res: any) => {
        if ((res.returnValue = 1)) {
          this.myForm.reset();
          this.submitted = false;
          this.getMaterialQuizes();
          this.toastr.success("Exam Added successfully");
        }
        this.spinner.hide();
      });
    }
  }

  deleteMaterialQuiz(Quiz: any) {
    this.spinner.show();
    this.SubjectMaterialsService.deleteMaterialQuiz(Quiz.Id).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          let i = this.AttachedQuiz.indexOf(Quiz);
          this.AttachedQuiz.splice(i, 1);
          this.toastr.success("تم الحذف");
        }
        this.spinner.hide();
      }
    );
  }

  openDeleateDialog(Quiz: any): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: Quiz.TemplateDetails?.Name || Quiz.examDetails?.exam_ar_name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.deleteMaterialQuiz(Quiz);
      });
  }

  //Cahnge Exam and Template Validators
  examValidator() {
    let exam = this.myForm.controls["examId"].value;
    if (exam != null) {
      this.myForm.controls["templateId"].setValue(null);
    }
  }

  //Cahnge Exam and Template Validators
  TemplateValidator() {
    let template = this.myForm.controls["templateId"].value;
    if (template != null) this.myForm.controls["examId"].setValue(null);
  }
}
