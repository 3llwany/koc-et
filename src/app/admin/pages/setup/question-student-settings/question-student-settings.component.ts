import { teacherBySubEduComp } from 'app/admin/models/admin/educations';
import { GeneralService } from 'app/shared/services/General/general.service';
import { AuthService } from 'app/shared/services/auth/auth.service'; 
import { SubjectsService } from 'app/admin/services/Admin/subjects.service'; 
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CustomeValidator } from 'app/shared/validators/customeValid.validator'; 

declare var $: any;
@Component({
  selector: 'app-question-student-settings',
  templateUrl: './question-student-settings.component.html',
  styleUrls: ['./question-student-settings.component.scss'],
})
export class QuestionStudentsSettingsComponent implements OnInit {
  EduCompId: any;
  subjectId: any;
  Teachers: teacherBySubEduComp[] = [];
  myForm!: FormGroup;
  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private SubjectsService: SubjectsService,
    private authserv: AuthService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.subjectId = params.get('subjectId');
    });
  }

  ngOnInit(): void {
    //get Current EduCompId
    this.EduCompId = this.authserv.getEduCompId();
    this.getTeacherByEduCompId();

    this.myForm = this.fb.group({
      subjectId: [this.subjectId, Validators.required],
      EduCompId: [this.EduCompId, Validators.required],
      teacherId: ['', Validators.required],
      typeId: ['', Validators.required],
      PrivatePrice: ['', Validators.required],
      PublicPrice: ['', Validators.required],
      IfPublicAccessibleAfterLecturesCount: ['', Validators.required],
    });
    this.changeType();
  }
  get FormCtrl() {
    return this.myForm.controls;
  }

  //On Add Question Settinges
  addQuestionSettings() {
    this.submitted = true;
    let isValid = this.myForm.valid;
    if (isValid) {
      $('#loadingGif').show();
      this.SubjectsService.addQuestionSettings(
        this.EduCompId,
        this.myForm.value
      ).subscribe((res: any) => {
        if (res.returnString == 'Success' && res.returnValue == 1) {
          this.toastr.success('settings added successfully');
          this.resetManual();
          $('#loadingGif').hide();
        }
      });
    }
  }

  //get Teacher By EduCompId
  getTeacherByEduCompId() {
    $('#loadingGif').show();
    this.SubjectsService.getTeacherBySubjectAndEduCompId(
      this.EduCompId,
      this.subjectId
    ).subscribe((res: any) => {
      if (res.retunValue == 1) {
        this.Teachers = res.teachers;
        $('#loadingGif').hide();
      }
    });
  }

  //OnChange  Type
  changeType() {
    this.myForm.controls['typeId'].valueChanges.subscribe((data) => {
      this.changeValidators();
    });
  }

  //OnChange Type Change Validators
  changeValidators() {
    let typeId = this.myForm.controls['typeId'].value;

    if (typeId == '1' || typeId == 1) {
      this.myForm.controls['PrivatePrice'].clearValidators();
      this.myForm.controls['PrivatePrice'].reset();

      this.myForm.controls['PublicPrice'].setValidators([
        Validators.required,
        CustomeValidator.minusNum,
      ]);

      this.myForm.controls[
        'IfPublicAccessibleAfterLecturesCount'
      ].setValidators([Validators.required, CustomeValidator.minusNum]);
    }

    if (typeId == '2' || typeId == 2) {
      this.myForm.controls['PublicPrice'].clearValidators();
      this.myForm.controls['PublicPrice'].reset();

      this.myForm.controls[
        'IfPublicAccessibleAfterLecturesCount'
      ].clearValidators();

      this.myForm.controls['IfPublicAccessibleAfterLecturesCount'].reset();

      this.myForm.controls['PrivatePrice'].setValidators([
        Validators.required,
        CustomeValidator.minusNum,
      ]);
    }

    this.myForm.controls['PublicPrice'].updateValueAndValidity();
    this.myForm.controls['PrivatePrice'].updateValueAndValidity();
    this.myForm.controls[
      'IfPublicAccessibleAfterLecturesCount'
    ].updateValueAndValidity();
  }

  resetManual() {
    this.myForm.reset();
    this.submitted = false;
    this.myForm.controls['teacherId'].setValue('');
    this.myForm.controls['typeId'].setValue('');
  }
}
