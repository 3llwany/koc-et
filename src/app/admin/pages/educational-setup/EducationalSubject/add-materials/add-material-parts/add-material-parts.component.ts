import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { IGetPartVM, IPartVM } from "app/admin/models/admin/educations";
import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-material-parts",
  templateUrl: "./add-material-parts.component.html",
  styleUrls: ["./add-material-parts.component.scss"],
})
export class AddMaterialPartsComponent implements OnInit {
  @Input("materialId") materialId: any;
  parts: IPartVM[] = [];
  myForm: FormGroup;
  submitted = false;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private SubjectMaterialsService: SubjectMaterialsService,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      materialId: [this.materialId, Validators.required],
      Id: [null],
      videoTypeId: ["", Validators.required],
      Name: ["", [Validators.required, CustomeValidator.whiteSpace]],
      Path: [""],
      SecondaryPath: [""],
      view_percentage: [90, [Validators.required, CustomeValidator.minusNum]],
    });

    if (this.materialId != null || this.materialId != undefined) {
      this.FormCtrl.materialId?.setValue(this.materialId);
      this.getMaterialParts();
    }
  }

  ngOnChanges(): void {
    if (this.materialId != null || this.materialId != undefined) {
      this.FormCtrl.materialId?.setValue(this.materialId);
      this.getMaterialParts();
    }
  }

  get FormCtrl() {
    return this.myForm.controls;
  }

  // get Material Parts
  getMaterialParts() {
    this.spinner.show();
    this.SubjectMaterialsService.getMaterialParts(this.materialId).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          //  console.log("Parts", res);
          this.parts = res.MaterialParts;
        }
        this.spinner.hide();
      }
    );
  }

  // get Part ById
  getPartById(id: any) {
    this.spinner.show();
    this.SubjectMaterialsService.getPartById<IGetPartVM>(id).subscribe(
      (res) => {
        //   console.log("Part", res);
        this.myForm.patchValue(res.MaterialPart);
        this.spinner.hide();
      }
    );
  }

  // Start: add Subject
  addPart() {
    this.submitted = true;
    if (this.myForm.valid) {
      this.spinner.show();
      this.SubjectMaterialsService.addPart(this.myForm.value).subscribe(
        (res: any) => {
          // console.log(res);
          if (res.returnValue == 1) {
            this.getMaterialParts();
            this.myForm.reset();
            this.FormCtrl.videoTypeId?.setValue("");
            this.FormCtrl.materialId?.setValue(this.materialId);
            this.FormCtrl.view_percentage?.setValue(90);

            if (this.myForm.controls["Id"] == null)
              this.toastr.success("تم إضافة جزء المحاضرة");
            else {
              this.toastr.success("تم تعديل جزء المحاضرة");
            }
            this.submitted = false;
          }
          this.spinner.hide();
        }
      );
    }
  }

  deletePart(part: IPartVM) {
    this.spinner.show();
    this.SubjectMaterialsService.deletePart(part.Id).subscribe((res: any) => {
      if (res.returnValue == 1) {
        let i = this.parts.indexOf(part);
        this.parts.splice(i, 1);
        this.toastr.success("تم الحذف");
        this.spinner.hide();
      }
    });
  }

  openDeleateDialog(part: IPartVM): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: part.Name,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.deletePart(part);
      });
  }
}
