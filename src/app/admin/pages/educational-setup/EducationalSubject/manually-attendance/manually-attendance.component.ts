import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { IOfflineLectureAttendeeslVM } from "app/admin/models/admin/educations";
import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-manually-attendance",
  templateUrl: "./manually-attendance.component.html",
  styleUrls: ["./manually-attendance.component.scss"],
})
export class ManuallyAttendanceComponent implements OnInit {
  functionId: number;
  subjectId: any;
  lectureID: any;
  studentName?: string;
  studentSearched: IOfflineLectureAttendeeslVM = null;
  myForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private SubjectMaterialsService: SubjectMaterialsService,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.subjectId = params.get("subjectId");
      this.route.queryParamMap.subscribe((params) => {
        this.functionId = Number(params.get("functionId"));
      });
    });
    this.route.paramMap.subscribe((params) => {
      this.lectureID = params.get("materialId");
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      lectureID: [this.lectureID],
      studentName: [""],
      studentEmail: [""],
      studentMobile: [""],
      studentCode: [""],
      attendBool: [true],
    });
  }

  //search student to Attendance Manual
  searchAttendanceManual() {
    this.spinner.show();
    this.SubjectMaterialsService.searchAttendanceManual(
      this.myForm.value
    ).subscribe((res: any) => {
      this.studentSearched = res.studentSearched;
      if (!res.studentSearched) this.toastr.info("لم يتم العثور علي الطالب");
      this.myForm.controls["studentName"].setValue(
        res.studentSearched?.username
      );
      this.spinner.hide();
    });
  }

  //update student tAttendance Manual
  updateAttendanceManual() {
    this.spinner.show();
    this.SubjectMaterialsService.updateAttendanceManual(
      this.myForm.value
    ).subscribe((res: any) => {
      console.log(res);
      if (res.returnValue == 1) {
        this.toastr.success(res.returnString);
      } else {
        this.toastr.error(res.returnString);
      }
      this.spinner.hide();
    });
  }

  resetForm() {
    this.myForm.reset();
    this.studentSearched = null;
  }
}
