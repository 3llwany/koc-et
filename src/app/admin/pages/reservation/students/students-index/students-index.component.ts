import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { SearchStudentsService } from "app/admin/services/Admin/searchStudents.service";
import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import {
  studyingGroupsDropVM,
  statutsDropVM,
  student,
} from "app/shared/models/general/general";
import { MatTableDataSource } from "@angular/material/table";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { studentVM } from "app/admin/models/admin/student-group";
import { MatPaginator } from "@angular/material/paginator";
import { ActivatedRoute } from "@angular/router";
import { MatSort } from "@angular/material/sort";
@Component({
  selector: "app-students-index",
  templateUrl: "./students-index.component.html",
  styleUrls: ["./students-index.component.scss"],
})
export class StudentsIndexComponent implements OnInit {
  EduCompId: any;
  functionId: number;
  groups: studyingGroupsDropVM[] = [];
  Statuts: statutsDropVM[] = [];

  students: student[] = [];
  myForm!: FormGroup;
  displayedColumns: string[] = [
    "#",
    "email",
    "mobile",
    "name",
    "code",
    "actions",
  ];
  dataSource: MatTableDataSource<studentVM>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  p: number = 1;
  maxSize = 9;
  itemsCount: any;
  userId: any = null;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private SearchStudentsService: SearchStudentsService,
    private SubjectMaterialsService: SubjectMaterialsService,
    private authserv: AuthService,
    private spinner: NgxSpinnerService
  ) {
    // route.queryParamMap.subscribe((params) => {
    //   this.functionId = Number(params.get("functionId"));
    //   if (this.functionId) {
    //     this.authserv
    //       .getUserRowFunctions(this.functionId)
    //       .subscribe((res: any) => {
    //         if (res) {
    //           this.rowFunctions = res;
    //         }
    //       });
    //   }
    // });
  }

  ngOnInit(): void {
    //get Current EduCompId
    this.EduCompId = this.authserv.getEduCompId();

    this.myForm = this.fb.group({
      queryStringEm: ["", Validators.email],
      queryStringCo: [""],
      queryStringPhoneNumber: [""],
      queryStringMozakretyCode: [""],
      statusId: [""],
      studyingGroup: [""],
      page: [""],
    });
    //this.getGroupsByEduCompId();
    this.getStudentsByEduCompId(1);
    this.getStudentGroupsAndStatuts();
  }

  //Get Students ByEduCompId
  getStudentsByEduCompId(p: number) {
    this.myForm.controls["page"]?.setValue(p);
    this.p = p;
    this.spinner.show();
    this.SearchStudentsService.getStudentsByEduCompId(
      this.EduCompId,
      this.myForm.value
    ).subscribe((res: any) => {
      console.log("getStudents", res);
      this.students = res.lists;
      console.log("hello", res.lists);
      this.dataSource = new MatTableDataSource(res.lists);
      this.itemsCount = res.totalCount;
      this.spinner.hide();
    });
  }

  //Get Students ByEduCompId
  getStudentGroupsAndStatuts() {
    this.spinner.show();
    this.SearchStudentsService.getStudentGroupsAndStatuts(
      this.EduCompId
    ).subscribe((res: any) => {
      this.groups = res.studyingGroups;
      this.Statuts = res.status;
      this.spinner.hide();
    });
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.getStudentGroupsAndStatuts();
    });

    this.authserv.branchId.subscribe((e) => {
      this.getStudentsByEduCompId(1);
    });

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  deleteStudent(user_ID: number) {
    let confirmed = confirm("Are you sure?");
    if (confirmed) {
      this.spinner.show();
      this.SearchStudentsService.deleteStudent(
        this.EduCompId,
        user_ID
      ).subscribe((res: any) => {
        console.log("deleteStudent", res);
        if (res.returnValue == 1) {
          let i = this.students.findIndex((e) => e.user_ID == user_ID);
          console.log(i);
          this.students.splice(i, 1);
          this.toastr.success("تم الحذف");
        } else console.log("Error:", res);
        this.spinner.hide();
      });
    }
  }

  getUserId(userId: any) {
    this.userId = userId;
  }
}
