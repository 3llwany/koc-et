import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Location } from "@angular/common";
import { ExamsService } from "app/admin/services/Admin/exams.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ExamViewModel } from "app/admin/models/admin/exam";
import { AuthService } from "./../../../../../shared/services/auth/auth.service";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";

@Component({
  selector: "app-upload-exam-grades",
  templateUrl: "./upload-exam-student-grades.component.html",
  styleUrls: ["./upload-exam-student-grades.component.scss"],
})
export class UploadExamStudentGradesComponent implements OnInit {
  Exam;
  myForm!: FormGroup;
  errorMsg = false;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public location: Location,
    private toastr: ToastrService,
    private ExamsService: ExamsService,
    private AuthService: AuthService,
    private spinner: NgxSpinnerService
  ) {
    this.Exam = new ExamViewModel();

    this.route.paramMap.subscribe((params) => {
      this.Exam.id = parseInt(params.get("examId"));
    });

    this.getExamById(this.Exam.id);
  }

  ngOnInit(): void {
    this.Exam.EduCompId = this.AuthService.getEduCompId();

    this.myForm = this.fb.group({
      examId: ["", Validators.required],
      file: ["", Validators.required],
      examGrade: ["", [Validators.required, CustomeValidator.minusNum]],
    });
  }

  getExamById(examId: number) {
    this.spinner.show();
    this.ExamsService.getExamById(examId).subscribe((response) => {
      console.log("getExamById: ", response);
      if (response) {
        this.Exam = response;
      }
      this.spinner.hide();
    });
  }

  UploadExamStudentGrades() {
    if (this.myForm.valid) {
      this.spinner.show();
      this.ExamsService.UploadExamStudentGrades(this.myForm.value).subscribe(
        (res: any) => {
          if (res.returnValue == 1) {
            //  console.log(res);
            this.toastr.success("تم رفع الدرجات");
          } else this.toastr.error(res.returnString);
          this.spinner.hide();
        }
      );
    }
  }

  //Attache File
  onChange(event: any) {
    let fileName = <File>event.target.files[0].name;
    let fileSize = <File>event.target.files[0].size;
    let fileType = <File>event.target.files[0].type;
    let LastModified = <File>event.target.files[0].lastModified;
    let LastModifiedDate = <File>event.target.files[0].lastModifiedDate;

    if (event.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        let fileReder = event.target.result;
        let data = {
          FileAsBase64: fileReder,
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        console.log(data);
        this.myForm.controls["file"].setValue(data);
      };
    }
  }
}
