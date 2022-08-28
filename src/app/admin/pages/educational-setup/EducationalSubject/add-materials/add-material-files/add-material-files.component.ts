import { Component, Input, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { Attache } from "app/admin/models/admin/educations";
import { SubjectMaterialsService } from "app/admin/services/Admin/subjectMaterials.service";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-add-material-files",
  templateUrl: "./add-material-files.component.html",
  styleUrls: ["./add-material-files.component.scss"],
})
export class AddMaterialFilesComponent implements OnInit {
  @Input("materialId") materialId: any;
  Attaches: Attache[] = [];
  myForm!: FormGroup;
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
      materialName: ["", [Validators.required, CustomeValidator.whiteSpace]],
      fileBase64: [null, [Validators.required]],
    });

    if (this.materialId != null || this.materialId != undefined) {
      this.FormCtrl?.materialId?.setValue(this.materialId);
      this.getMaterialAttaches();
    }
  }

  ngOnChanges(): void {
    if (this.materialId != null || this.materialId != undefined) {
      this.FormCtrl?.materialId?.setValue(this.materialId);
      this.getMaterialAttaches();
    }
  }

  get FormCtrl() {
    return this.myForm?.controls;
  }

  getMaterialAttaches() {
    this.spinner.show();
    this.SubjectMaterialsService.getMaterialAttaches(this.materialId).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          //    console.log("Attaches", res);
          this.Attaches = res.MaterialAttachs;
        }
        this.spinner.hide();
      }
    );
  }

  addAttach() {
    this.submitted = true;
    if (!this.FormCtrl.fileBase64?.value) {
      this.toastr.warning("Must Choose File");
      return;
    }
    if (this.myForm.valid) {
      this.spinner.show();
      let data = { mat_attach: this.myForm.value };
      this.SubjectMaterialsService.addAttach(data).subscribe((res: any) => {
        this.myForm.reset();
        this.getMaterialAttaches();
        this.toastr.success("Attach Added successfully");
        this.submitted = false;
        this.spinner.hide();
      });
    }
  }

  deleteAttach(Attache: Attache) {
    this.spinner.show();
    this.SubjectMaterialsService.deleteAttach(Attache.Id).subscribe(
      (res: any) => {
        if (res.returnValue == 1) {
          let i = this.Attaches.indexOf(Attache);
          this.Attaches.splice(i, 1);
          this.toastr.success("تم الحذف");
        }
        this.spinner.hide();
      }
    );
  }

  openDeleateDialog(Attache: Attache): void {
    this.dialog
      .open(DeleteDialogComponent, {
        data: {
          msg: Attache.materialName,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) this.deleteAttach(Attache);
      });
  }

  Filepath;
  type;
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
        let file = {
          FileAsBase64: fileReder.replace("data:application/pdf;base64,", ""),
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        this.Filepath = fileReder;
        this.type = fileType;
        this.FormCtrl.fileBase64.setValue(file);
      };
    }
  }
}
