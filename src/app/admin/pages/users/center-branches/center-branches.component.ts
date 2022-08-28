import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { MatTableDataSource } from "@angular/material/table";
import { ActivatedRoute } from "@angular/router";
import {
  IAddEditBranchModel,
  IBranchesViewModel,
  IBranchModel,
  IDistrictDropModel,
} from "app/admin/models/roles/function";
import { BranchesService } from "app/admin/services/roles/branches.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { IRowFunctionVM } from "app/shared/models/general/general";

@Component({
  selector: "app-center-branches",
  templateUrl: "./center-branches.component.html",
  styleUrls: ["./center-branches.component.scss"],
})
export class CenterBranchesComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  EduCompId: any;

  functionId: number;
  rowFunctions: IRowFunctionVM[];
  itemsCount: number = 0;

  branches: IBranchModel[] = [];
  districts: IDistrictDropModel[] = [];

  get branchIdCtrl() {
    return this.myForm.get("branchId");
  }
  get branchNameCtrl() {
    return this.myForm.get("branchName");
  }
  //get addressCtrl() { return this.myForm.get('address'); }
  get districtIdCtrl() {
    return this.myForm.get("districtId");
  }

  displayedColumns: string[] = ["#", "name", "region", "actions"];
  dataSource: MatTableDataSource<IBranchModel>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild("addBtn", { read: ElementRef }) addBtn: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    public authserv: AuthService,
    private msg: ToastrService,
    private branchService: BranchesService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
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
              //console.log(`row Functions for"${this.functionId}": `, res);
            }
          });
      }
    });
  }

  ngOnInit(): void {
    this.myForm = this.fb.group({
      branchId: [0],
      branchName: ["", [Validators.required, CustomeValidator.whiteSpace]],
      //address: [null],
      districtId: ["", Validators.required],
    });

    this.EduCompId = this.authserv.getEduCompId();
    this.branchService
      .getAllDistricts<IDistrictDropModel[]>()
      .subscribe((response) => {
        if (response) {
          // console.log("districts: ", response);
          this.districts = response;
        }
      });

    this.getAllBranches(1);
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllBranches(pageNumber: number) {
    this.spinner.show();
    this.branchService
      .getAllAllCenterBranches<IBranchesViewModel>(pageNumber)
      .subscribe((response) => {
        if (response) {
          // console.log("branches: ", response);
          this.branches = response.centerBrnachesList;
          this.dataSource = new MatTableDataSource(response.centerBrnachesList);
          this.itemsCount = response.itemsCount;
        }
        this.spinner.hide();
      });
  }

  editBranch(branch: IBranchModel) {
    this.branchIdCtrl?.setValue(branch.Id);
    this.branchNameCtrl?.setValue(branch.Name);
    //this.addressCtrl?.setValue(branch.address);
    this.districtIdCtrl?.setValue(branch.districtId);
    this.addBtn.nativeElement.innerText = "update";
  }

  removeBranch(branch: IBranchModel) {
    this.spinner.show();
    this.branchService.deleteBranch(branch.Id).subscribe((response) => {
      if (response) {
        // console.log("user: ", response);
        this.getAllBranches(1);
        this.msg.success("تم مسح الفرع بنجاح");
      }
      this.spinner.hide();
    });
  }

  onSubmit() {
    this.submitted = true;

    if (this.myForm.valid) {
      this.spinner.show();
      let obj = {} as IAddEditBranchModel;
      obj.Id = this.branchIdCtrl?.value;
      obj.Name = this.branchNameCtrl?.value;
      obj.districtId = this.districtIdCtrl?.value;
      obj.EduCompId = this.EduCompId;

      //  console.log("NOW CALL SERVER: ", obj);

      this.branchService
        .addEditBranches<IAddEditBranchModel, any>(obj)
        .subscribe((response) => {
          this.submitted = false;

          if (response && response.returnValue === 200) {
            this.addBtn.nativeElement.innerText = "Add";
            // console.log("created: ", response);

            // let index = this.branches.findIndex(r => r.Id == response.Id);
            // if (index === -1) {
            //   this.msg.success("تم إنشاء الصلاحيه بنجاح");
            //   this.branches.push(response.branch);
            // } else {
            //   this.branches[index] = response.branch;
            //   this.msg.success("تم تعديل الصلاحيه بنجاح");
            // }

            this.getAllBranches(1);
            this.msg.success("تم إضافه/تعديل البيانات الفرع بنجاح");
            this.myForm.reset();
            //console.log("branches: ", this.branches);
          }
          this.spinner.hide();
        });
    }
  }

  openDeleateDialog(branch: IBranchModel): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: branch.Name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.removeBranch(branch);
      });
  }
}
