import { Component, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import { IRoleFunctionsModel } from "app/admin/models/roles/roles";
import {
  IBranchViewModel,
  IUserBranchModel,
  IUserBranchFunctionViewModel,
  IUserFunctionModel,
  IAddUserBranchFunctionsModel,
  IBranchUserModel,
  IUserModel,
} from "app/admin/models/roles/user";
import { RolesService } from "app/admin/services/roles/roles.service";
import { UsersService } from "app/admin/services/roles/users.service";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { IRowFunctionVM } from "app/shared/models/general/general";
import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-user-branches-roles",
  templateUrl: "./user-branches-roles.component.html",
  styleUrls: ["./user-branches-roles.component.scss"],
})
export class UserBranchesRolesComponent implements OnInit {
  myForm: FormGroup;
  userId: number;
  roleId: number;
  functionId: number;
  EduCompId: number;
  submitted: boolean = false;
  branches: IBranchViewModel[] = [];
  functions: IRoleFunctionsModel[] = [];
  functionIds: number[] = [];
  checkedfunctionIds: number[] = [];
  rowFunctions: IRowFunctionVM[];
  userBranchesWithFunctions: IUserBranchModel[] = [];
  displayedColumns: string[] = [
    "#",
    "branchName",
    "FunctionName",
    "from",
    "to",
    "actions",
  ];
  dataSource: MatTableDataSource<IUserBranchModel>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msg: ToastrService,
    private userService: UsersService,
    public authserv: AuthService,
    private roleService: RolesService,
    private dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe((param) => {
      this.userId = Number(param.get("userId"));
      this.roleId = Number(param.get("roleId"));
    });

    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
      console.log("functionId", this.functionId);
      if (this.functionId) {
        this.authserv
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
              //    console.log(`RowFunctions for"${this.functionId}": `, res);
            }
          });
      }
    });
  }

  get branchIdCtrl() {
    return this.myForm.get("branchId");
  }
  get fromDateCtrl() {
    return this.myForm.get("fromDate");
  }
  get toDateCtrl() {
    return this.myForm.get("toDate");
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      branchId: ["", Validators.required],
      fromDate: [""],
      toDate: [""],
    });

    this.EduCompId = Number(this.authserv.getEduCompId());

    this.getAllBranchesByCenter();
    this.getAllFunctions();
    this.getAllUserBranchesWithFunctions();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllBranchesByCenter() {
    this.spinner.show();
    this.userService
      .getAllBranchesByCenter<IBranchViewModel[]>(this.EduCompId)
      .subscribe((response) => {
        if (response) {
          // console.log("branches: ", response);
          this.branches = response;
        }
        this.spinner.hide();
      });
  }

  getAllFunctions() {
    this.spinner.show();
    this.roleService
      .getAllFunctionsByRoleId<IRoleFunctionsModel[]>(this.roleId)
      .subscribe((response) => {
        if (response) {
          // console.log("functions by roleId: ", response);
          this.functions = response;
        }
        this.spinner.hide();
      });
  }

  onFunctionToogle(functionId: number, $event: any) {
    if ($event.checked === true) {
      this.functionIds.push(functionId);
    } else if ($event.checked === false) {
      let index = this.functionIds.findIndex((id) => id === functionId);
      this.functionIds.splice(index, 1);
    }
  }

  getAllUserBranchesWithFunctions() {
    this.spinner.show();
    this.roleService
      .getAllUserBranchesWithFunctions<IUserBranchFunctionViewModel>(
        this.userId
      )
      .subscribe((response) => {
        if (response) {
          //   console.log("brances with functions for user: ", response);
          this.userBranchesWithFunctions = response.branchUserList;
          this.dataSource = new MatTableDataSource(response.branchUserList);
          for (let funParent of this.userBranchesWithFunctions) {
            for (let fun of funParent.roleFunctionsList) {
              this.checkedfunctionIds.push(fun.Id);
            }
          }
        }
        this.spinner.hide();
      });
  }

  removeBranch(branch: IUserBranchModel) {
    this.spinner.show();
    this.roleService
      .deleteUserBranchRoleFunction(this.userId, branch.branchId)
      .subscribe((response) => {
        if (response) {
          //  console.log("remove brances with functions: ", response);
          let i = this.dataSource.data.findIndex((e) => (e = branch));
          this.dataSource.data.splice(i, 1);
          this.dataSource.paginator = this.paginator;
          this.msg.success("branch has been deleted success");
        }
        this.spinner.hide();
      });
  }

  onDeleteFunction(func: any) {
    this.spinner.show();
    this.roleService
      .deleteUserRoleFunctions(func.centerBranchUserFuncId)
      .subscribe((response) => {
        if (response) {
          // console.log("remove function: ", response);
          this.getAllUserBranchesWithFunctions();
          this.msg.success("function has been deleted success");
        }
        this.spinner.hide();
      });
  }

  onSubmit() {
    this.submitted = true;
    if (this.functionIds.length <= 0) {
      this.msg.warning("Must select at least one function");
      return;
    }

    if (this.myForm.valid) {
      this.spinner.show();
      let obj = {} as IAddUserBranchFunctionsModel;
      obj.roleFunctionsIds = this.functionIds;
      obj.branchUser = {} as IBranchUserModel;
      obj.branchUser.userId = this.userId;
      obj.branchUser.branchId = this.branchIdCtrl?.value;
      obj.branchUser.from = this.fromDateCtrl?.value;
      obj.branchUser.to = this.toDateCtrl?.value;

      this.roleService
        .addUserBranchesAndRoleFunctions(obj)
        .subscribe((response) => {
          this.submitted = false;
          if (response) {
            //console.log("add new branch with functions: ", response);
            this.getAllUserBranchesWithFunctions();
            this.msg.success("branch has been added success");
            this.myForm.reset();
            this.functionIds = [];
            this.checkedfunctionIds = [];
          }
          this.spinner.hide();
        });
    }
  }

  openDeleateDialog(branch: IUserBranchModel): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: branch.branchName,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.removeBranch(branch);
      });
  }

  openDeleateFunctionDialog(func: IUserFunctionModel): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: func.functionName,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.onDeleteFunction(func);
      });
  }
}
