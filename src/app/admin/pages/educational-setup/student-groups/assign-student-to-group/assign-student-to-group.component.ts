import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute, Router } from "@angular/router";
import { studentVM } from "app/admin/models/admin/student-group";
import { IRowFunctionVM } from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { StudentsGroupsService } from "app/admin/services/Admin/studentsGroups.service";
import { ToastrService } from "ngx-toastr";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";

@Component({
  selector: "app-assign-student-to-group",
  templateUrl: "./assign-student-to-group.component.html",
  styleUrls: ["./assign-student-to-group.component.css"],
})
export class AssignStudentToGroupComponent implements OnInit {
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  groupId: number = 0;
  EduCompId: any;
  p: number = 1;
  groupMaxCount: number = 0;
  groupCount: number = 0;
  groupName: string;
  ExcelFile: any = null;
  students: studentVM[] = [];
  dataSource: MatTableDataSource<studentVM>;
  displayedColumns: string[] = ["Name", "Email", "Mobile", "actions"];
  myForm!: FormGroup;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private route: ActivatedRoute,
    private authserv: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private StudentsGroupsService: StudentsGroupsService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.route.queryParamMap.subscribe((params) => {
      this.groupId = Number(params.get("groupId"));

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

  ngOnInit() {
    this.EduCompId = this.authserv.getEduCompId();

    this.myForm = this.fb.group({
      page: [1],
      groupId: [this.groupId],
      EduCompId: [this.EduCompId],
      emailQuery: [""],
      mobileQuery: [""],
    });

    this.searchStudents(1);
  }
  get EduCompIdCtrl() {
    return this.myForm.get("EduCompId");
  }
  get groupIdCtrl() {
    return this.myForm.get("groupId");
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.EduCompIdCtrl.setValue(e.EduCompId);
      this.searchStudents(1);
    });

    this.authserv.branchId.subscribe((e) => {
      this.searchStudents(1);
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  searchStudents(p: number) {
    this.myForm.controls["page"]?.setValue(p);
    this.p = p;
    this.spinner.show();
    this.p = p;
    this.StudentsGroupsService.searchStudents(this.myForm.value).subscribe(
      (res: any) => {
        this.students = res.List;
        // console.log("students", this.students);
        this.dataSource = new MatTableDataSource(res.List);
        // this.groupMaxCount = res.List.TotalItemCount;
        this.groupCount = res.Count;
        console.log("Count", res.Count);
        this.spinner.hide();
      }
    );
  }

  addStudent() {
    this.spinner.show();
    console.log("form values add", this.myForm.value);
    this.StudentsGroupsService.checkStudent(this.myForm.value).subscribe(
      (student: any) => {
        // console.log("check student", student);
        if (student.InGroup) {
          this.toastr.info("هذا الطالب موجود مسبقاَ داخل المجموعة");
          return;
        } else {
          this.spinner.show();
          // console.log("student", student);
          this.StudentsGroupsService.addStudent(
            student.student?.userId,
            this.groupId
          ).subscribe((res: any) => {
            // console.log('addStudent', res);
            if (
              res.returnString ==
              "Student already exists in a group with the same teacher and subject"
            )
              this.toastr.info(
                "هذا الطالب موجود مسبقاَ داخل مجموعة لنفس المادة ونفس المدرس"
              );
            else {
              this.toastr.success("تم إضافة الطالب بنجاح");
              this.searchStudents(1);
            }
            this.spinner.hide();
          });
        }
      }
    );
  }

  openDeleateDialog(student: studentVM): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: student.Name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.deleteStudent(student);
      });
  }

  deleteStudent(student: studentVM) {
    this.spinner.show();
    this.StudentsGroupsService.deleteStudent(
      student.userId,
      this.groupId
    ).subscribe((res: any) => {
      if (res.returnValue == 1) {
        let i = this.dataSource.data.findIndex((e) => (e = student));
        this.dataSource.data.splice(i, 1);
        this.dataSource.paginator = this.paginator;
        this.toastr.success("تم حذف الطالب من المجموعة");
      } else this.toastr.warning(res);
      this.spinner.hide();
    });
  }

  uploadStudentsByExcel() {
    if (this.ExcelFile == null) this.toastr.info("يجب إرفاق Excel File");
    else {
      this.spinner.show();
      this.StudentsGroupsService.uploadStudentsByExcel({
        ExcelFile: this.ExcelFile,
        groupId: this.groupId,
      }).subscribe((res: any) => {
        if (res.returnValue == 1) this.toastr.success("تم رفع الملف بنجاح ");
        else console.log("ExcelFile", res);
        this.spinner.hide();
      });
    }
  }

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
        this.ExcelFile = data;
      };
    }
  }
}
