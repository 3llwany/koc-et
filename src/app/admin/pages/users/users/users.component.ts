import { ActivatedRoute } from "@angular/router";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { IRolesViewModel } from "app/admin/models/roles/roles";
import {
  IAddEditUserModel,
  IUserModel,
  IUserViewModel,
} from "app/admin/models/roles/user";
import { RolesService } from "app/admin/services/roles/roles.service";
import { UsersService } from "app/admin/services/roles/users.service";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { AuthService } from "app/shared/services/auth/auth.service";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { IRowFunctionVM } from "app/shared/models/general/general";

@Component({
  selector: "app-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"],
})
export class UsersComponent implements OnInit {
  myForm: FormGroup;
  EduCompId: number;
  submitted: boolean = false;
  roles: IRolesViewModel[] = [];
  functionId: number;
  rowFunctions: IRowFunctionVM[];
  itemsCounts: number = 0;
  items: number = 16184;
  p: number = 0;

  displayedColumns: string[] = [
    "#",
    "name",
    "email",
    "mobile",
    "role",
    "option",
  ];
  dataSource: MatTableDataSource<IUserModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild("addBtn", { read: ElementRef }) addBtn: ElementRef;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private userService: UsersService,
    public authserv: AuthService,
    private roleService: RolesService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,
    private route: ActivatedRoute
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

  ngOnInit(): void {
    this.myForm = this.fb.group(
      {
        userId: [0, [Validators.required]],
        userName: [
          null,
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z \u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+$/
            ),
            CustomeValidator.whiteSpace,
          ],
        ],
        email: [null, [Validators.required, Validators.email]],
        phone: [
          "",
          [
            Validators.required,
            Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_ \-\(\)\S*$]*$/),
            Validators.minLength(11),
            Validators.maxLength(11),
            CustomeValidator.startsWith,
          ],
        ],
        roleId: [null, [Validators.required]],
        password: [
          null,
          [
            Validators.required,
            CustomeValidator.whiteSpace,
            Validators.minLength(3),
          ],
        ],
        confirmedPass: [null],
      },
      {
        validator: CustomeValidator.mustMatch("password", "confirmedPass"),
      }
    );

    this.EduCompId = Number(this.authserv.getEduCompId());

    this.roleService.getAllRoles<IRolesViewModel[]>().subscribe((response) => {
      if (response) {
        this.roles = response;
      }
    });

    this.getAllUsers(1);
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllUsers(pageNumber: number) {
    // this.itemsCounts = 0;
    this.p = pageNumber;
    this.spinner.show();

    this.userService
      .getAllUsers<IUserViewModel>(this.EduCompId, pageNumber)
      .subscribe((response) => {
        if (response) {
          //  console.log("users: ", response);
          this.dataSource = new MatTableDataSource(
            response.centerBrnachesList.reverse()
          );
          this.itemsCounts = response.itemsCounts;
        }
        this.spinner.hide();
      });
  }

  editUser(user: IUserModel) {
    this.FormCtrls.userId?.setValue(user.user_ID);
    this.FormCtrls.userName?.setValue(user.ar_name);
    this.FormCtrls.email?.setValue(user.account_email);
    this.FormCtrls.phone?.setValue(user.mobile);
    this.FormCtrls.roleId?.setValue(user.roleId);
    this.FormCtrls.password?.setValue(user.account_password);
    this.FormCtrls.confirmedPass?.setValue(user.account_password);
    this.addBtn.nativeElement.innerText = "update";
  }

  removeUser(user: IUserModel) {
    this.userService.deleteUser(user.user_ID).subscribe((response) => {
      if (response) {
        //    console.log("user: ", response);
        this.getAllUsers(1);
        this.toastr.success("تم مسح المستخدم بنجاح");
      }
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.spinner.show();
      let obj = {} as IAddEditUserModel;
      obj.user = {} as IUserModel;
      obj.user.user_ID = this.FormCtrls.userId?.value;
      obj.user.ar_name = this.FormCtrls.userName?.value;
      obj.user.account_email = this.FormCtrls?.email?.value;
      obj.user.mobile = this.FormCtrls.phone?.value;
      obj.user.roleId = this.FormCtrls.roleId?.value;
      obj.user.account_password = this.FormCtrls.password?.value;

      obj.roleId = this.FormCtrls.roleId?.value;
      obj.EduCompId = this.EduCompId;

      this.userService
        .addEditUser<IAddEditUserModel, any>(obj)
        .subscribe((response) => {
          this.submitted = false;
          //  console.log("created: ", response);

          if (response && response !== null) {
            if (response.returnValue == 0) {
              this.toastr.error(response.returnString);
            } else {
              this.getAllUsers(1);
              this.toastr.success("تم إضافه/تعديل البيانات المستخدم بنجاح");
              this.myForm.reset();
              this.addBtn.nativeElement.innerText = "Add";
            }
          }
          this.spinner.hide();
        });
    }
  }

  openDeleateDialog(user: IUserModel): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: user.ar_name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.removeUser(user);
      });
  }
}
