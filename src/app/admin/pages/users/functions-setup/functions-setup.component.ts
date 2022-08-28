import { CustomeValidator } from "./../../../../shared/validators/customeValid.validator";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { Router, ActivatedRoute } from "@angular/router";
import {
  IFunctionViewModel,
  IAddEditFunctionModel,
} from "app/admin/models/roles/function";
import { IFunctionsModel } from "app/admin/models/roles/roles";
import { FunctionsService } from "app/admin/services/roles/functions.service";
import { RolesService } from "app/admin/services/roles/roles.service";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { IRowFunctionVM } from "app/shared/models/general/general";

@Component({
  selector: "app-functions-setup",
  templateUrl: "./functions-setup.component.html",
  styleUrls: ["./functions-setup.component.scss"],
})
export class FunctionsSetupComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;

  itemsCount: any;
  functions: IFunctionsModel[] = [];

  functionId: number;
  rowFunctions: IRowFunctionVM[];

  get functionIdCtrl() {
    return this.myForm.get("functionId");
  }
  get functionNameEnCtrl() {
    return this.myForm.get("functionNameEn");
  }
  get functionNameArCtrl() {
    return this.myForm.get("functionNameAr");
  }
  get linkCtrl() {
    return this.myForm.get("link");
  }

  displayedColumns: string[] = ["#", "arName", "enName", "link", "actions"];
  dataSource: MatTableDataSource<IFunctionsModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("addBtn", { read: ElementRef }) addBtn: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public authserv: AuthService,
    private msg: ToastrService,
    private roleService: RolesService,
    private functionService: FunctionsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
      console.log("functionId", this.functionId);
      if (this.functionId) {
        this.authserv
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
              console.log(`RowFunctions for"${this.functionId}": `, res);
            }
          });
      }
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      functionId: [0],
      functionNameEn: ["", [Validators.required, CustomeValidator.whiteSpace]],
      functionNameAr: ["", [Validators.required, CustomeValidator.whiteSpace]],
      link: [null],
    });

    this.getAllFunctions(1);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllFunctions(pageNumber: number) {
    this.spinner.show();
    this.roleService
      .getAllFunctions<IFunctionViewModel>(pageNumber, false)
      .subscribe((response) => {
        if (response) {
          //console.log("functions: ", response);
          this.functions = response.functions;
          this.dataSource = new MatTableDataSource(response.functions);
          this.itemsCount = response.itemsCount;
        }
        this.spinner.hide();
      });
  }

  editFunction(func: IFunctionsModel) {
    this.functionIdCtrl?.setValue(func.Id);
    this.functionNameEnCtrl?.setValue(func.function_en_name);
    this.functionNameArCtrl?.setValue(func.functionName);
    this.linkCtrl?.setValue(func.functionURL);
    this.addBtn.nativeElement.innerText = "update";
  }

  removeFunction(func: IFunctionsModel) {
    this.spinner.show();
    this.functionService.deleteFunction(func.Id).subscribe((response) => {
      if (response) {
        // console.log("function: ", response);
        this.getAllFunctions(1);
        this.msg.success("تم مسح الوظيفه بنجاح");
      }
      this.spinner.hide();
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.spinner.show();
      let obj = {} as IAddEditFunctionModel;
      obj.Id = this.functionIdCtrl?.value;
      obj.functionName = this.functionNameArCtrl?.value;
      obj.function_en_name = this.functionNameEnCtrl?.value;
      obj.functionURL = this.linkCtrl?.value;

      // console.log("NOW CALL SERVER: ", obj);

      this.functionService
        .addEditFunction<IAddEditFunctionModel, any>(obj)
        .subscribe((response) => {
          this.addBtn.nativeElement.innerText = "Add";
          this.submitted = false;
          if (response && response.returnValue === 200) {
            //console.log("created: ", response);

            this.getAllFunctions(1);
            this.msg.success("تم إضافه/تعديل البيانات الوظيفه بنجاح");
            this.myForm.reset();
            // console.log("functions: ", this.functions);
          }
          this.spinner.show();
        });
    }
  }

  openDeleateDialog(func: IFunctionsModel): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: func.functionName,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.removeFunction(func);
      });
  }
}
