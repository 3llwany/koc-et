import { NgxSpinnerService } from "ngx-spinner";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import { IRolesViewModel } from "app/admin/models/roles/roles";
import { RolesService } from "app/admin/services/roles/roles.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { MatDialog } from "@angular/material/dialog";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { IRowFunctionVM } from "app/shared/models/general/general";

@Component({
  selector: "app-add-role",
  templateUrl: "./add-role.component.html",
  styleUrls: ["./add-role.component.scss"],
})
export class AddRoleComponent implements OnInit {
  myForm!: FormGroup;
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  roles: IRolesViewModel[] = [];
  EduCompId: any;
  get roleIdCtrl() {
    return this.myForm.get("roleId");
  }
  get roleNameCtrl() {
    return this.myForm.get("roleName");
  }
  get EduCompIdCtrl() {
    return this.myForm.get("EduCompId");
  }
  displayedColumns: string[] = ["#", "Name", "actions"];
  dataSource: MatTableDataSource<IRolesViewModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild("addBtn", { read: ElementRef }) addBtn: ElementRef;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public authserv: AuthService,
    private msg: ToastrService,
    private roleService: RolesService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
      if (this.functionId) {
        this.authserv
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
              // console.log(`RowFunctions for"${this.functionId}": `, res);
            }
          });
      }
    });
  }

  ngOnInit(): void {
    this.EduCompId = this.authserv.getEduCompId();
    this.myForm = this.fb.group({
      roleId: [0],
      roleName: [null, [Validators.required]],
      EduCompId: [this.EduCompId],
    });
    this.spinner.show();
    this.roleService
      .getAllRoles<IRolesViewModel[]>(this.EduCompIdCtrl.value)
      .subscribe((response) => {
        this.spinner.hide();
        if (response) {
          console.log("roles init: ", response);
          this.roles = response;
          this.dataSource = new MatTableDataSource(response);
          this.dataSource.paginator = this.paginator;
        }
      });
  }

  ngAfterViewInit() {
    this.authserv.EduCompId.subscribe((e) => {
      this.EduCompId = e.EduCompId;
      this.EduCompIdCtrl.setValue(e.EduCompId);
      this.roleService
        .getAllRoles<IRolesViewModel[]>(this.EduCompIdCtrl.value)
        .subscribe((response) => {
          this.spinner.hide();
          if (response) {
            console.log("roles after init: ", response);
            this.roles = response;
            this.dataSource = new MatTableDataSource(response);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        });
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  editRole(role: IRolesViewModel) {
    this.roleIdCtrl?.setValue(role.Id);
    this.roleNameCtrl?.setValue(role.roleName);
    this.EduCompIdCtrl.setValue(role.EduCompId);
    this.addBtn.nativeElement.innerText = "update";
  }

  removeRole(role: IRolesViewModel) {
    this.spinner.show();
    this.roleService.deleteRole(role.Id).subscribe((response: any) => {
      if (response.returnString == "Success") {
        //  console.log("roles: ", response);
        let index = this.dataSource.data.findIndex((r) => r.Id == role.Id);
        this.dataSource.data.splice(index, 1);
        this.dataSource.paginator = this.paginator;
        this.msg.success("تم مسح الصلاحيه بنجاح");
      } else this.msg.warning(response.returnString);
      this.spinner.hide();
    });
  }

  onSubmit() {
    if (!this.roleNameCtrl?.value) {
      this.msg.warning("يرجي إدخال اسم الصلاحيه");
      return;
    }

    if (this.myForm.valid) {
      this.spinner.show();
      let obj = {} as IRolesViewModel;
      obj.Id = this.roleIdCtrl?.value;
      obj.roleName = this.roleNameCtrl.value;
      obj.EduCompId = this.EduCompIdCtrl.value;
      console.log("role model", obj);
      this.roleService
        .addEditRole<IRolesViewModel, any>(obj)
        .subscribe((response) => {
          if (response && response.returnValue === 200) {
            // console.log("created: ", response);

            let index = this.roles.findIndex((r) => r.Id == response.role.Id);
            if (index === -1) {
              this.msg.success("تم إنشاء الصلاحيه بنجاح");
              this.dataSource.data.push(response.role);
              this.dataSource.paginator = this.paginator;
            } else {
              this.roles[index] = response.role;
              this.msg.success("تم تعديل الصلاحيه بنجاح");
            }
            this.myForm.reset();
            // console.log("roles: ", this.roles);
          }
          this.addBtn.nativeElement.innerText = "Add";
          this.spinner.hide();
        });
    }
  }

  openDeleateDialog(role: IRolesViewModel): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: role.roleName,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.removeRole(role);
      });
  }
}
