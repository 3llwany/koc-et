import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { SubjectsService } from "app/admin/services/Admin/subjects.service";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { IReservationVM } from "app/admin/models/admin/reservation";
import {
  IGetOfflineLectureAttendeeslVM,
  IOfflineLectureAttendeeslVM,
} from "app/admin/models/admin/educations";

@Component({
  selector: "app-upload-attendance",
  templateUrl: "./upload-attendance.component.html",
  styleUrls: ["./upload-attendance.component.scss"],
})
export class UploadAttendanceComponent implements OnInit {
  functionId: number;
  subjectId: any;
  materialId: any;
  subjectName: any;
  students: any[] = [];
  myForm!: FormGroup;

  displayedColumns: string[] = [
    "#",
    "name",
    "lecture",
    "group",
    "attendance",
    "outGroup",
    "refundBalance",
    "amount",
    "date",
  ];
  dataSource: MatTableDataSource<IOfflineLectureAttendeeslVM>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  itemsCount: number = 0;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private SubjectMaterialsService: SubjectMaterialsService,
    private SubjectsService: SubjectsService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.subjectId = params.get("subjectId");
      this.functionId = Number(params.get("functionId"));
    });
    this.route.paramMap.subscribe((params) => {
      this.materialId = params.get("materialId");
    });

    this.getSubjectByID();
  }

  ngOnInit(): void {
    this.offlineLectureAttendeesTable(1);
    this.myForm = this.fb.group({
      attendance: [true, Validators.required],
      uploadedFile: ["", Validators.required],
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  UploadStudentAttendance() {
    if (!this.myForm.controls["uploadedFile"].value) {
      this.toastr.warning("Must Choose File");
      return;
    } else {
      //this.errorMsg = false;
      this.spinner.show();
      this.SubjectMaterialsService.UploadStudentAttendance(
        this.materialId,
        this.myForm.controls["attendance"].value,
        this.myForm.controls["uploadedFile"].value
      ).subscribe((res: any) => {
        if (res.returnString == "Success") {
          this.offlineLectureAttendeesTable(1);
          this.toastr.success("تم رفع الحضور");
          this.myForm.reset();
        }
        this.spinner.hide();
      });
    }
  }

  offlineLectureAttendeesTable(p: number) {
    this.spinner.show();
    this.SubjectMaterialsService.offlineLectureAttendeesTable<IGetOfflineLectureAttendeeslVM>(
      this.materialId,
      p
    ).subscribe((res) => {
      this.dataSource = new MatTableDataSource(res.model);
      this.itemsCount = res.itemsCount;
      this.spinner.hide();
    });
  }

  getSubjectByID() {
    this.SubjectsService.getSubjectByID(this.subjectId).subscribe(
      (res: any) => {
        if (res.subject_id != null) {
          this.subjectName = res.subject_ar_name;
        }
      }
    );
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
          FileAsBase64: fileReder.replace(
            "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,",
            ""
          ),
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        console.log(data);
        this.myForm.controls["uploadedFile"].setValue(data);
      };
    }
  }
}
