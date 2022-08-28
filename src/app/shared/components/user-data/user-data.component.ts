import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { GeneralService } from "app/shared/services/General/general.service";
import { CustomeValidator } from "app/shared/validators/customeValid.validator";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-user-data",
  templateUrl: "./user-data.component.html",
  styleUrls: ["./user-data.component.scss"],
})
export class UserDataComponent implements OnInit {
  myForm: FormGroup;
  submitted: boolean = false;
  picturePath?: any;
  username: string;
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private GeneralServ: GeneralService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.returnProfile();
    this.myForm = this.fb.group(
      {
        ar_name: [
          "",
          [
            Validators.required,
            Validators.pattern(
              /^[a-zA-Z \u0600-\u065F\u066A-\u06EF\u06FA-\u06FF]+$/
            ),
            CustomeValidator.whiteSpace,
          ],
        ],
        mobile: [
          "",
          [
            Validators.required,
            Validators.pattern(/^(\(?\+?[0-9]*\)?)?[0-9_ \-\(\)\S*$]*$/),
            Validators.minLength(11),
            Validators.maxLength(11),
            CustomeValidator.startsWith,
          ],
        ],
        account_email: ["", [Validators.required, Validators.email]],
        account_password: [
          "",
          [
            Validators.required,
            CustomeValidator.whiteSpace,
            Validators.minLength(3),
          ],
        ],
        newPassword: [null, [Validators.minLength(3)]],
        ConfirmPassword: [null],
        profilePicture: [""],
      },
      {
        validator: CustomeValidator.mustMatch("newPassword", "ConfirmPassword"),
      }
    );
  }

  get FormCtrls() {
    return this.myForm.controls;
  }

  returnProfile() {
    this.spinner.show();
    this.GeneralServ.returnProfile().subscribe((res: any) => {
      this.myForm.patchValue(res.user);
      this.FormCtrls.profilePicture.setValue(res.picturePath);
      this.picturePath = `mozakretyapi${res.picturePath}`;
      this.FormCtrls.account_password.setValue("");
      this.username = res.user.ar_name;
      this.spinner.hide();
    });
  }

  editProfile() {
    this.submitted = true;
    if (this.myForm.valid) {
      this.spinner.show();
      this.GeneralServ.editProfile(this.myForm.value).subscribe((res: any) => {
        if (res.returnValue == 1) {
          this.toastr.success("تم التعديل");
          this.returnProfile();
        } else if (res.returnValue == 22) {
          this.toastr.error("يجب إدخال  كلمه المرور الصحيحة");
        }
        this.submitted = false;
        this.spinner.hide();
      });
    }
  }

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
        let data = {
          FileAsBase64: fileReder,
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        this.FormCtrls.profilePicture.setValue(data);
        this.picturePath = fileReder;
      };
    }
  }
}
