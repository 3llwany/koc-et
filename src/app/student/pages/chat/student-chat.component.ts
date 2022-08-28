import { AuthService } from "../../../shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { ActivatedRoute } from "@angular/router";
import { GeneralService } from "app/shared/services/General/general.service";
import {
  MsgsVM,
  MsgReplayVM,
  INewMsgVM,
  IReplayToMsgVM,
} from "app/student/models/ask-teacher";
import { AskTeacherService } from "app/student/services/AskTeacher.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-student-chat",
  templateUrl: "./student-chat.component.html",
  styleUrls: ["./student-chat.component.scss"],
})
export class StudentChatComponent implements OnInit {
  //AskTeacher
  accepted: any[] = null;
  p: number = 1;

  //Opend Msgs List
  opendMsgs: MsgsVM[];
  openMsgsCount: any;

  // Closed Msgs List
  closedMsgs: MsgsVM[];
  closedMgsCount: any;

  MsgReplaies: MsgReplayVM[]; //List of replaies For Msg
  TeacherSubjectId: number;

  // Current User Data
  currentUserPicPath: any;
  ar_name: any;
  currentUserId: any;

  attachecFilePath = null;

  myForm: FormGroup;
  newMsgForm: FormGroup;
  selectedMsgToReplay: MsgsVM = null;
  currentMsgUserData: MsgsVM;
  msgGroup?: any = null;
  isActive?: boolean = false;
  isStudent: boolean = false;
  isContentOverlay = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private AskTeacherServ: AskTeacherService,
    private route: ActivatedRoute,
    private GeneralService: GeneralService,
    private toaster: ToastrService,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.TeacherSubjectId = Number(params.get("teacherSubjectId"));
      console.log("TeacherSubjectId", this.TeacherSubjectId);
    });
  }

  ngOnInit(): void {
    this.isStudent = this.authService.isStudent();
    this.askTeacher(this.TeacherSubjectId);
    this.returnProfile();

    this.myForm = this.fb.group({
      threadId: [null, Validators.required],
      TeacherSubjectIds: [this.TeacherSubjectId, Validators.required],
      ParentReplyId: [null],
      Attach: [null],
      ReplyText: [""],
    });

    this.newMsgForm = this.fb.group({
      ThreadText: ["", Validators.required],
      ReplyText: ["", Validators.required],
      TeacherSubjectIds: [this.TeacherSubjectId, Validators.required],
      Attach: [null],
    });

    this.FormCtrl.TeacherSubjectIds.setValue(this.TeacherSubjectId);
    this.newMsgFormCtrl.TeacherSubjectIds.setValue(this.TeacherSubjectId);
  }

  get FormCtrl() {
    return this.myForm.controls;
  }
  get newMsgFormCtrl() {
    return this.newMsgForm.controls;
  }

  askTeacher(TeacherSubjectId: any) {
    this.spinner.show();
    this.AskTeacherServ.askTeacher(TeacherSubjectId).subscribe((res: any) => {
      this.accepted = res.accepted;
      if (res.accepted) {
        this.getOpenedMsgs(1, this.TeacherSubjectId);
        this.getClosedMsgs(1, this.TeacherSubjectId);
      }
      this.spinner.hide();
      console.log("askTeacher", res);
    });
  }

  getOpenedMsgs(p: any, TeacherSubId: any) {
    this.spinner.show();
    this.AskTeacherServ.getOpenedMsgs(p, TeacherSubId).subscribe((res: any) => {
      console.log("OpenedMsgs", res);
      this.opendMsgs = res.list;
      this.openMsgsCount = res.itemsCount;
      this.spinner.hide();
    });
  }

  getClosedMsgs(p: any, Teacher_Sub_Id: any) {
    this.spinner.show();
    this.AskTeacherServ.getClosedMsgs(p, Teacher_Sub_Id).subscribe(
      (res: any) => {
        console.log("ClosedMsgs", res);
        this.closedMsgs = res.list;
        this.closedMgsCount = res.itemsCount;
        this.spinner.hide();
      }
    );
  }

  getMsgReplaies(msgId: any) {
    this.spinner.show();
    this.AskTeacherServ.getMsgReplaies(msgId).subscribe((res: any) => {
      console.log("MsgReplaies", res);
      this.MsgReplaies = res.replies;
      // setTimeout(function () {
      //   $(".chat-box .chat-body").animate(
      //     { scrollTop: $(".chat-box .chat-body").prop("scrollHeight") },
      //     1000
      //   );
      // }, 1000);
      this.spinner.hide();
    });
  }

  createNewMsg() {
    let data: INewMsgVM = {
      ThreadText: this.newMsgFormCtrl.ThreadText?.value,
      ReplyText: this.newMsgFormCtrl.ReplyText?.value,
      TeacherSubjectId: this.TeacherSubjectId,
      Attach: this.newMsgFormCtrl.Attach?.value,
    };
    console.log(data);
    console.log(this.newMsgForm.valid);
    console.log(this.newMsgForm);
    if (this.newMsgForm.valid) {
      this.spinner.show();
      this.AskTeacherServ.createNewMsg(data).subscribe((res: any) => {
        //console.log(res);
        if (res.returnString == "Success") {
          this.FormCtrl.threadId.setValue(res.threadId);
          this.getOpenedMsgs(1, this.TeacherSubjectId);
          this.getMsgReplaies(res.threadId);
          this.spinner.hide();
        }
      });
    } else this.toaster.warning("Please Enter Title and yor Message");
  }

  ReplayToMessage() {
    this.spinner.show();
    let data: IReplayToMsgVM = this.myForm.value;
    console.log(data);
    if (this.myForm.valid) {
      this.AskTeacherServ.SendMessage(data).subscribe((res: any) => {
        console.log("ReplayTOMessage", res);
        if (res.returnString == "Success") {
          this.getOpenedMsgs(1, this.TeacherSubjectId);
          this.getMsgReplaies(this.FormCtrl.threadId.value);
          this.FormCtrl.ReplyText.reset();
          this.FormCtrl.Attach.reset();
          this.escpreview();
          // $(".chat-box .chat-body").animate(
          //   { scrollTop: $(".chat-box .chat-body").prop("scrollHeight") },
          //   1000
          // );
        } else {
          this.toaster.error(res.returnString);
        }
        this.spinner.hide();
      });
    }
  }

  selectMsg(msg: MsgsVM) {
    if (this.FormCtrl.threadId.value != msg.Id) {
      this.MsgReplaies = [];
    }
    this.getMsgReplaies(msg.Id);
    this.currentMsgUserData = msg;
    console.log("selectMsg", msg);
    this.FormCtrl.threadId.setValue(msg.Id);

    // $(".chat-box .chat-body").animate(
    //   { scrollTop: $(".chat-box .chat-body").prop("scrollHeight") },
    //   1000
    // );
  }

  getParentReplyId(msg: MsgsVM) {
    this.FormCtrl.ParentReplyId.setValue(msg.Id);
    this.selectedMsgToReplay = msg;
    if (msg) {
      console.log("ParentReplyIdMsg", msg);
    }
    console.log(this.myForm.value);
  }

  returnProfile() {
    this.spinner.show();
    this.GeneralService.returnProfile().subscribe((res: any) => {
      this.currentUserId = res.user.user_ID;
      this.ar_name = res.user.ar_name;
      this.currentUserPicPath = res.picturePath;
      this.spinner.hide();
    });
  }

  escpreview() {
    this.FormCtrl.Attach.setValue(null);
    this.FormCtrl.ParentReplyId.setValue("");
    this.selectedMsgToReplay = null;
    this.attachecFilePath = null;
  }

  // attache Replay Pic
  attacheReplayPic(event: any) {
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
        this.attachecFilePath = fileReder;
        let data = {
          FileAsBase64: fileReder,
          name: fileName,
          size: fileSize,
          type: fileType,
          LastModified: LastModified,
          LastModifiedDate: LastModifiedDate,
        };
        this.FormCtrl.Attach.setValue(data);
      };
    }
  }

  // attach New Msg Pic
  attachNewMsgPic(event: any) {
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
        this.attachecFilePath = fileReder;
        this.newMsgFormCtrl.Attach?.setValue(data);
      };
    }
  }

  onSidebarToggle() {
    this.isContentOverlay = true;
  }

  onContentOverlay() {
    this.isContentOverlay = false;
  }
}
