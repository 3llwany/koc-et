import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { Router, ActivatedRoute } from "@angular/router";
import {
  IWhatsAppMsgModel,
  IWhatsAppResponse,
} from "app/admin/models/whatsApp/whatsApp";
import { WhatsAppService } from "app/admin/services/whatsApp/whats-app.service";
import { AuthService } from "app/shared/services/auth/auth.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-send-whatsapp-msg",
  templateUrl: "./send-whatsapp-msg.component.html",
  styleUrls: ["./send-whatsapp-msg.component.scss"],
})
export class SendWhatsappMsgComponent implements OnInit {
  myForm!: FormGroup;

  isSubmitted = false;
  eduCompId: any;
  errors: string[] = [];

  get sendToStudentWhatsAppCtrl() {
    return this.myForm.get("sendToStudentWhatsApp");
  }
  get sendToFatherWhatsAppCtrl() {
    return this.myForm.get("sendToFatherWhatsApp");
  }
  get sendToMotherWhatsAppCtrl() {
    return this.myForm.get("sendToMotherWhatsApp");
  }
  get msgCtrl() {
    return this.myForm.get("msg");
  }
  get fileCtrl() {
    return this.myForm.get("file");
  }

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private whatsAppService: WhatsAppService,
    private authService: AuthService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.eduCompId = this.authService.getEduCompId();

    this.myForm = this.fb.group({
      sendToStudentWhatsApp: [false],
      sendToFatherWhatsApp: [false],
      sendToMotherWhatsApp: [false],
      msg: ["", Validators.required],
      file: ["", Validators.required],
    });
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
        this.fileCtrl?.setValue(data);
      };
    }
  }

  onSubmit() {
    if (
      this.sendToStudentWhatsAppCtrl?.value === false &&
      this.sendToFatherWhatsAppCtrl?.value === false &&
      this.sendToMotherWhatsAppCtrl?.value === false
    ) {
      this.toastr.warning(
        "Please select who can receive your what's app message"
      );
      return;
    }

    this.isSubmitted = true;

    if (this.myForm.valid) {
      this.spinner.show();
      let obj = {} as IWhatsAppMsgModel;

      obj.adminEducationCompanyId = +this.eduCompId;
      obj.sendToStudentWhatsApp = this.sendToStudentWhatsAppCtrl?.value;
      obj.sendToFatherWhatsApp = this.sendToFatherWhatsAppCtrl?.value;
      obj.sendToMotherWhatsApp = this.sendToMotherWhatsAppCtrl?.value;
      obj.msg = this.msgCtrl?.value;
      obj.file = this.fileCtrl?.value;

      this.whatsAppService.sendWhatsAppMsg(obj).subscribe((response) => {
        if (response) {
          if ((response as IWhatsAppResponse).isSendAllSuccess) {
            this.toastr.success("Message has been send to all success");
            this.myForm.reset();
          } else if (!(response as IWhatsAppResponse).isSendAllSuccess) {
            //console.log('ERRORS: ', (response as IWhatsAppResponse).errors);
            this.toastr.success("Message has been send to some success");
            this.errors = (response as IWhatsAppResponse).errors;
          }
          this.myForm.reset();
        }
        this.spinner.hide();
      });
    }
  }
}
