import { Component, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatPaginator } from "@angular/material/paginator";
import { MatTableDataSource } from "@angular/material/table";
import { studentGroupVM } from "app/admin/models/admin/student-group";
import { StudentsGroupsService } from "app/admin/services/Admin/studentsGroups.service";
import {
  IRowFunctionVM,
  teacherByEduCompId,
} from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { GeneralService } from "app/shared/services/General/general.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from "@angular/router";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { MatDialog } from "@angular/material/dialog";
@Component({
  selector: "app-student-group-index",
  templateUrl: "./student-group-index.component.html",
  styleUrls: ["./student-group-index.component.css"],
})
export class StudentGroupIndexComponent implements OnInit {
  myForm!: FormGroup;
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  p: number = 1;
  maxSize = 9;
  itemsCount: any;
  EduCompId: any;
  Teachers: teacherByEduCompId[] = [];
  groups: studentGroupVM[] = [];
  displayedColumns: string[] = [
    "name",
    "teacher",
    "material",
    "maxno",
    "actions",
  ];
  dataSource: MatTableDataSource<studentGroupVM>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private StudentsGroupsService: StudentsGroupsService,
    private toastr: ToastrService,
    private authserv: AuthService,
    private dialog: MatDialog,
    private GeneralService: GeneralService,
    private spinner: NgxSpinnerService
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

  ngOnInit() {
    this.EduCompId = this.authserv.getEduCompId();

    // console.log("teachers",this.Teachers);
    this.myForm = this.fb.group({
      nameQuery: [""],
      teacherUserId: [""],
      EduCompId: [this.EduCompId],
      currentYear: [1],
      page: [""],
    });
    this.getTeachersByEducompId();
    this.getStudentsGroups(1);
  }
  get EduCompIdCtrl() {
    return this.myForm.get("EduCompId");
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.EduCompIdCtrl.setValue(e.EduCompId);
      this.getStudentsGroups(1);
      this.getTeachersByEducompId();
    });

    this.authserv.branchId.subscribe((e) => {
      this.getStudentsGroups(1);
      this.getTeachersByEducompId();
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  getStudentsGroups(p: number) {
    this.myForm.controls["page"]?.setValue(p);
    this.p = p;
    this.spinner.show();
    //console.log("form value",this.myForm.value);
    this.StudentsGroupsService.getStudentsGroups(this.myForm.value).subscribe(
      (res: any) => {
        this.groups = res.List;
        // console.log("groups", res);
        this.dataSource = new MatTableDataSource(res.List);
        this.itemsCount = res.TotalItemCount;
        this.spinner.hide();
      }
    );
  }

  removeGroup(group: studentGroupVM) {
    this.StudentsGroupsService.RemoveStudentGroup(group.Id).subscribe(
      (response) => {
        if (response) {
          //  console.log('deleted: ', response);
          let deletedIndex = this.dataSource.data.findIndex(
            (e) => e.Id == group.Id
          );
          this.dataSource.data.splice(deletedIndex, 1);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          this.toastr.success("تم حذف المجموعة");
        }
      }
    );
  }

  openDeleateDialog(group: studentGroupVM): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: group.Name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.removeGroup(group);
      });
  }

  getTeachersByEducompId() {
    this.GeneralService.getTeachersByEducompId(this.EduCompId).subscribe(
      (res: any) => {
        this.Teachers = res.lstTeachers;
      }
    );
  }
}
