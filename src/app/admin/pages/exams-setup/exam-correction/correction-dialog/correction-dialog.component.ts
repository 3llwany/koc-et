import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { subjectsDropdownVM } from "app/admin/models/admin/educations";
import {  ITeacherDropModel } from "app/admin/models/admin/exam";
import {
  IRowFunctionVM,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { ExamsService } from "app/admin/services/Admin/exams.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { ActivatedRoute, Router } from "@angular/router";
import { MatDialog, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-correction-dialog",
  templateUrl: "./correction-dialog.component.html",
  styleUrls: ["./correction-dialog.component.css"],
})
export class CorrectionDialogComponent implements OnInit {
  EduCompId: any;
  functionId: number;
  submitted:false;
  myForm!: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private authserv: AuthService,
    private router: Router,
    private msg: ToastrService,
    private GeneralService: GeneralService,
    // private toastr: ToastrService,
    private examService: ExamsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
  ) {
    // this.route.queryParamMap.subscribe((params) => {
    //   this.groupId = Number(params.get("groupId"));


    //   this.functionId = Number(params.get("functionId"));
    //   //  console.log("functionId", this.functionId);
    //   if (this.functionId) {
    //     this.authserv
    //       .getUserRowFunctions(this.functionId)
    //       .subscribe((res: any) => {
    //         if (res) {
    //           this.rowFunctions = res;
    //           //  console.log(`RowFunctions for"${this.functionId}": `, res);
    //         }
    //       });
    //   }
    // });
  }

 
  get questionNameCtrl() {
    return this.myForm.get("questionName");
  }
  get questionAnswerCtrl() {
    return this.myForm.get("studentAnswer");
  }
  get markCtrl() {
    return this.myForm.get("mark");
  }
  get teacherCommentCtrl() {
    return this.myForm.get("teacherComment");
  }
  get questionIdCtrl() {
    return this.myForm.get("questionId");
  }
  get examStudentIdCtrl() {
    return this.myForm.get("examStudentId");
  }
  get teacherUserIdCtrl() {
    return this.myForm.get("teacherUserId");
  }
  get questionMarkCtrl(){
    return this.myForm.get("questionMark");
  }
  get FormCtrl(){
    return this.myForm.controls;
  }
  ngOnInit(): void {
    console.log("data",this.data);
    this.EduCompId = this.authserv.getEduCompId();
    this.myForm = this.fb.group({
      questionName:[''],
      studentAnswer:[''],
      questionId: [],
      examStudentId:[],
      teacherComment:['',Validators.required],
      teacherUserId:[],
      questionMark:[],
      mark:[,Validators.required],

    });
this.questionNameCtrl.setValue(this.data.msg.questionName);
this.questionNameCtrl.disable();
this.questionIdCtrl.setValue(this.data.msg.questionId);
this.examStudentIdCtrl.setValue(this.data.msg.examStudentId);
this.teacherUserIdCtrl.setValue(this.data.msg.teacherUserId);
this.questionMarkCtrl.setValue(this.data.msg.questionMark);
this.FormCtrl.studentAnswer.setValue(this.data.msg.studentAnswer);
  }
  

  CorrectQuestion()
  {

    let valid = this.myForm.valid;
    if (valid) {
      console.log("my form",this.myForm.value);
if(this.markCtrl.value>this.questionMarkCtrl.value)
{
  this.msg.error("يجب ادخال قيمة النتيجة أقل من القية النهائية");
  return;
}
else{


  this.spinner.show();
      // console.log("form data", this.myForm.value);
      this.examService.submitCorrection(this.myForm.value).subscribe(
        (res: any) => {
          if (res.returnValue == 1) {

              this.msg.success("تم تصحيح السؤال");
              this.dialog.closeAll();
          } else this.msg.error(res.returnString);
          this.spinner.hide();
        }
      );
    }
  
    }
  }

  
}
