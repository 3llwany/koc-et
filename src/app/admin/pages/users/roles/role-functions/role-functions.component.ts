import { Component, OnInit } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  IFunctionsModel,
  IRoleFunctionsModel,
  IAddEditRoleFunctionsModel,
} from "app/admin/models/roles/roles";
import { RolesService } from "app/admin/services/roles/roles.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-role-functions",
  templateUrl: "./role-functions.component.html",
  styleUrls: ["./role-functions.component.scss"],
})
export class RoleFunctionsComponent implements OnInit {
  roleId: any;
  functions: IFunctionsModel[] = [];
  roleFunctions: IRoleFunctionsModel[] = [];
  functionIds: number[] = [];
  roleName: string = "";

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private msg: ToastrService,
    private roleService: RolesService,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe((param) => {
      this.roleId = param.get("roleId");
    });
  }

  ngOnInit(): void {
    this.getAllFunctions();
    this.getAllRoleFunctions();
  }

  getAllFunctions() {
    this.spinner.show();
    this.roleService
      .getAllFunctions<IFunctionsModel[]>(0, true)
      .subscribe((response) => {
        if (response) {
          console.log("functions: ", response);
          this.functions = response;
        }
        this.spinner.hide();
      });
  }

  getAllRoleFunctions() {
    this.spinner.show();
    this.roleService
      .getAllRoleFunctions<IRoleFunctionsModel[]>(this.roleId)
      .subscribe((response) => {
        if (response) {
          console.log("role functions: ", response);
          this.roleFunctions = response;
          this.roleName = this.roleFunctions[0].roleName;

          for (let i = 0; i < this.roleFunctions.length; i++) {
            this.functionIds.push(this.roleFunctions[i].function.Id);
          }
          //  console.log("edit functions IDs", this.functionIds);
        }
        this.spinner.hide();
      });
  }

  onFunctionToogle(functionId: number, $event: any) {
    // console.log("FEATURE EVENT: ", $event.checked);
    //console.log("FEATURE ID: ", featureId);

    if ($event.checked === true) {
      this.functionIds.push(functionId);
    } else if ($event.checked === false) {
      let index = this.functionIds.findIndex((id) => id === functionId);
      this.functionIds.splice(index, 1);
    }
    // console.log("FEATURE IDs", this.functionIds);
    //this.vehicleFeaturesCtrl.setValue(this.functionIds);
  }

  onAddFunctions() {
    let obj = {} as IAddEditRoleFunctionsModel;
    obj.roleId = this.roleId;
    obj.functionsList = this.functionIds;
    this.spinner.show();
    this.roleService
      .addEditRoleFunctions<IAddEditRoleFunctionsModel, any>(obj)
      .subscribe((response) => {
        if (response && response.returnValue === 200) {
          this.msg.success("تم تعديل وظائف الصلاحيه بنجاح");
          console.log("add/edit functions: ", response);
        }
        this.spinner.hide();
      });
  }
}
