import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { MatDialog } from "@angular/material/dialog";
import { ActivatedRoute, Router } from "@angular/router";
import { ConfirmDialogComponent } from "app/shared/components/dialogs/confirm-dialog/confirm-dialog.component";
import { DeleteDialogComponent } from "app/shared/components/dialogs/delete-dialog/delete-dialog.component";
import { GeneralService } from "app/shared/services/General/general.service";
import { MsgsVM, MsgReplayVM } from "app/student/models/ask-teacher";
import { AskTeacherService } from "app/student/services/AskTeacher.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-chats",
  templateUrl: "./chats.component.html",
  styleUrls: ["./chats.component.scss"],
})
export class ChatsComponent implements OnInit {
  //Pagination vars
  openPages: number = 1;
  closedPages: number = 1;
  maxsize = 5;

  //Opend Msgs List
  opendMsgs: MsgsVM[] = [];
  openMsgsCount: any;

  // Closed Msgs List
  closedMsgs: MsgsVM[] = [];
  closedMgsCount: any;

  MsgReplaies: MsgReplayVM[] = []; //List of replaies For an Msg
  TeacherSubjectIds: any;
  ParentReplyId?: number;
  currentMsgUserData?: MsgsVM;
  selectedMsgToReplay: MsgsVM = null;

  // Current User Vars
  currentUserPicPath: any;
  ar_name: any;
  currentUserId: any;

  attachecFilePath: any = null;
  myForm!: FormGroup;
  isContentOverlay = false;

  constructor(
    private fb: FormBuilder,
    private AskTeacherServ: AskTeacherService,
    private GeneralServ: GeneralService,
    private toaster: ToastrService,
    private route: ActivatedRoute,
    private router: Router,
    public dialog: MatDialog,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.myForm = this.fb.group({
      threadId: [null, Validators.required],
      TeacherSubjectIds: [[], Validators.required],
      ParentReplyId: [null],
      Attach: [null],
      ReplyText: [""],
    });

    this.getTeacherSubjectIds();
    this.returnProfile();
  }

  get FormCtrl() {
    return this.myForm.controls;
  }

  getTeacherSubjectIds() {
    this.AskTeacherServ.getTeacherSubjectIds().subscribe((res: any) => {
      if (res) {
        //  console.log("TeacherSubjectIds", res);
        this.FormCtrl.TeacherSubjectIds.setValue(res);
        this.getOpenedMsgs();
        this.getClosedMsgs();
      }
      this.spinner.hide();
    });
  }

  // Return opend msgs
  getOpenedMsgs() {
    this.spinner.show();
    this.AskTeacherServ.getTeacherOpenedClosedMsgs(
      this.openPages,
      true,
      this.FormCtrl.TeacherSubjectIds.value
    ).subscribe((res: any) => {
      // console.log("OpenedMsgs", res);
      this.opendMsgs = res.messageThreads;
      this.openMsgsCount = res.itemsCount;
      this.spinner.hide();
    });
  }

  // Return Closed msgs
  getClosedMsgs() {
    this.spinner.show();
    this.AskTeacherServ.getTeacherOpenedClosedMsgs(
      this.closedPages,
      false,
      this.FormCtrl.TeacherSubjectIds.value
    ).subscribe((res: any) => {
      //console.log("ClosedMsgs", res);
      this.closedMsgs = res.messageThreads;
      this.closedMgsCount = res.itemsCount;
      this.spinner.hide();
    });
  }

  getMsgReplaies(msgId: any) {
    this.spinner.show();
    this.AskTeacherServ.getTeacherMsgReplaies(msgId).subscribe((res: any) => {
      this.MsgReplaies = res.replies;
      // console.log('getMsgReplaies', res);
      // setTimeout(function () {
      //   $(".chat-box .chat-body").animate(
      //     { scrollTop: $(".chat-box .chat-body").prop("scrollHeight") },
      //     1000
      //   );
      // }, 1000);

      this.spinner.hide();
    });
  }

  ReplayToMessage() {
    this.spinner.show();
    if (this.myForm.valid) {
      this.AskTeacherServ.SendMessage(this.myForm.value).subscribe(
        (res: any) => {
          // console.log('ReplayToMessage', res);
          if (res.returnString == "Success") {
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
        }
      );
    }
  }

  closeMsg(msgId: any) {
    this.spinner.show();
    this.AskTeacherServ.closeMsg(msgId).subscribe((res: any) => {
      //  console.log('closeMsg', res);
      if (res.returnValue == 1) {
        this.toaster.success("تم اغلاق الرسالة");
        this.currentMsgUserData!.Opened = !this.currentMsgUserData.Opened;
        this.getOpenedMsgs();
        this.getClosedMsgs();
      }
      this.spinner.hide();
    });
  }

  removeReply(msgId: number) {
    this.spinner.show();
    this.AskTeacherServ.removeReply(msgId).subscribe((res: any) => {
      //  console.log('removeReply', res);
      if (res.returnValue == 1) {
        this.toaster.success("تم حذف الرسالة");
        this.getMsgReplaies(this.FormCtrl.threadId.value);
      }
      this.spinner.hide();
    });
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

  //Start: Return Profile Data
  returnProfile() {
    this.spinner.show();
    this.GeneralServ.returnProfile().subscribe((res: any) => {
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

  track(index: number, el: any): number {
    return el.Id;
  }

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

  onSidebarToggle() {
    this.isContentOverlay = true;
  }

  onContentOverlay() {
    this.isContentOverlay = false;
  }

  openDeleteDialog(msg: MsgReplayVM): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      data: {
        title: "General.ConfirmDelete",
        msg: msg.Message,
      },
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) this.removeReply(msg.Id);
    });
  }

  openConfirmDialog(msgId: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: "General.ConfirmCloseMsg",
        btn: "General.Confirm",
      },
    });
    dialogRef.afterClosed().subscribe((confirm) => {
      if (confirm) this.closeMsg(msgId);
    });
  }
}
