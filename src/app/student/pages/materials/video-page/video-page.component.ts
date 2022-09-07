import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { MaterialsService } from "app/student/services/materials.service";
import { StudentService } from "app/student/services/student.service";
import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import { environment } from "environments/environment";

//import * as $ from 'jquery';

declare function getCurrentTime(): any; // import sprout func from https://c.sproutvideo.com/player_api.js
declare function bind(): any; // import sprout func from https://c.sproutvideo.com/player_api.js
declare function play(): any; // import sprout func from https://c.sproutvideo.com/player_api.js
declare function pause(): any; // import sprout func from https://c.sproutvideo.com/player_api.js
declare function seek(): any; // import sprout func from https://c.sproutvideo.com/player_api.js
declare function Player(): any; // import sprout func from https://c.sproutvideo.com/player_api.js
declare const Vimeo: any; // import sprout func from https://c.sproutvideo.com/player_api.js
declare const SV: any; // import sprout func from https://c.sproutvideo.com/player_api.js
import { NgxSpinnerService } from "ngx-spinner";

@Component({
  selector: "app-video-page",
  templateUrl: "./video-page.component.html",
  styleUrls: ["./video-page.component.scss"],
})
export class VideoPageComponent implements OnInit {
  //Start Vars
  VideoReady: boolean;
  materialData?: any = [];
  parts?: any = [];
  materials_attach?: any = [];
  AttachedExams: any = [];
  AttachedTemplates?: any = [];
  TeacherData?: any = [];
  EduCompList?: any = [];
  teacherSubjectId?: any;
  lecPath: any;
  MatId?: any; //VideoID
  partId?: any; //partId
  MatPrice?: any;
  teacherId?: any;
  subjectId?: any;
  userID?: any;
  isPurchased?: any;
  CustomDiscount?: any;
  priceDiscount?: any;
  IsAvaliable?: boolean = true;
  Views_Limit?: number;
  number_views?: number;
  studentExtraViews?: number;
  canStudentWatch?: boolean = true;
  viewDone = false;
  currentPartType: any;
  view_percentage: any;
  //Start Quize
  QuizTimes: any = [];
  QuizQuestions: any = [];
  examsReady = false;
  tempsReady = false;
  ExamsSolved = false;
  IsMaterialAvaliable = false;
  environment: string;

  // iframe = document.getElementById('CurruntVideoiframe');
  //Video = new Vimeo.Player(this.iframe);

  constructor(
    private MatServ: MaterialsService,
    private TeacherSubServ: TeacherSubjectsService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private matServ: MaterialsService,
    private StudentServ: StudentService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    // Get teacherSubjectId, teacherId, subjectId
    this.route.parent?.paramMap.subscribe((params: any) => {
      this.teacherSubjectId = params.get("teacherSubjectId");
      this.teacherId = params.get("teacherId");
      this.subjectId = params.get("subjectId");
    });
    //Get MatId
    this.route.paramMap.subscribe((params: any) => {
      this.MatId = params.get("materialId");
    });
    this.environment = environment.apiURL;
  } //Endconstructor

  ngOnInit(): void {
    this.ReturnMaterialByMatId(this.MatId, this.teacherSubjectId);
    this.ReturnTeacherData(this.subjectId, this.teacherId);
    this.EduCompList = localStorage.getItem("EduCompList");
    let str = this.lecPath;
  } //End ngOnInit

  // Return MAt Data, parts, exams,  files
  ReturnMaterialByMatId(MatId: any, teacherSubjectId: any) {
    this.spinner.show();
    let data = {
      mat_ID: MatId,
      teacher_subject_id: teacherSubjectId,
      mat_type: 3,
    };
    this.MatServ.ReturnMaterialByMatId(data).subscribe((res: any) => {
      console.log("Material", res);
      this.viewDone = false;
      this.materialData = res.material;
      this.materials_attach = res.materials_attach;
      this.parts = res.parts;
      this.AttachedExams = res.exams;
      this.AttachedTemplates = res.templates;
      this.userID = res.userID;
      this.priceDiscount = res.material.priceDiscount;
      this.CustomDiscount = res.material.CustomDiscount;
      this.isPurchased = res.material.Purchased;
      this.IsAvaliable = res.material.IsAvaliable;
      this.MatPrice = res.material.price;
      this.ExamsSolved = res.ExamsSolved;
      //if mat has more than 1 part make it equal lecPath and get views limit, views number
      if (res.parts.length >= 1) {
        this.lecPath = res.parts[0].Path;
        // this.lecPath =
        //   "https://videos.sproutvideo.com/embed/709adcb31f19e5c6f8/cd8cf2e796aa69d3";
        this.partId = res.parts[0].Id;
        this.Views_Limit = res.parts[0].Views_Limit;
        this.number_views = res.parts[0].studentViews;
        this.studentExtraViews = res.parts[0].studentExtraViews;
        this.canStudentWatch = res.parts[0].canStudentWatch;
        this.currentPartType = res.parts[0].videoTypeId;
        this.view_percentage = res.parts[0].view_percentage;
        let limit_views_count =
          res.parts[0].Views_Limit + res.parts[0].studentExtraViews;
        let msg =
          "لقد شاهدت عدد (" +
          this.number_views +
          ")  مرات من (" +
          limit_views_count +
          ") مرات  المتاحه";
        //this.getQuizTimes(this.MatId, this.partId);
        if (
          (this.isPurchased || this.MatPrice == 0) &&
          limit_views_count != 0 &&
          this.number_views != 0
        ) {
          this.toastr.info(msg, "ملاحظات");
        } else if (
          (this.isPurchased || this.MatPrice == 0) &&
          limit_views_count == 0 &&
          this.number_views != 0
        ) {
          let msg = "لقد شاهدت عدد (" + this.number_views + ") مرات";
          this.toastr.info(msg, "ملاحظات");
        }
      }
      this.spinner.hide();
    });
  }

  //

  // Get part Link, Views Limit and views number  to Change iframe src
  getPartPath(id: any) {
    this.spinner.show();
    this.lecPath = "";
    this.VideoReady = false;
    let data = {
      mat_ID: this.MatId,
      teacher_subject_id: this.teacherSubjectId,
      mat_type: 3,
    };
    this.MatServ.ReturnMaterialByMatId(data).subscribe((res: any) => {
      this.spinner.hide();
      //console.log(res)
      let part = res.parts.find((x: any) => x.Id === id);
      this.lecPath = part.Path;
      this.partId = part.Id;
      this.Views_Limit = part.Views_Limit;
      this.number_views = part.studentViews;
      this.studentExtraViews = part.studentExtraViews;
      this.canStudentWatch = part.canStudentWatch;
      this.currentPartType = part.videoTypeId;
      this.view_percentage = part.view_percentage;
      this.viewDone = false;
      let limit_views_count = part.Views_Limit + part.studentExtraViews;
      //this.getQuizTimes(this.MatId, this.partId);
      let msg =
        "لقد شاهدت عدد (" +
        this.number_views +
        ")  مرات من (" +
        limit_views_count +
        ")  مرات  المتاحه";
      if (
        (this.isPurchased || this.MatPrice == 0) &&
        limit_views_count != 0 &&
        this.number_views != 0
      ) {
        this.toastr.info(msg, "ملاحظات");
      } else if (
        (this.isPurchased || this.MatPrice == 0) &&
        limit_views_count == 0 &&
        this.number_views != 0
      ) {
        let msg = "لقد شاهدت عدد (" + this.number_views + ") مرات";
        this.toastr.info(msg, "ملاحظات");
      }
    });
  }
  //

  // Return Teacher Name Subject Details
  ReturnTeacherData(subject_id: any, teacher_ID: any) {
    let data = {
      subject_id: subject_id,
      teacher_ID: teacher_ID,
    };
    this.TeacherSubServ.ReturnTeacherData(data).subscribe((res: any) => {
      //console.log(res);
      this.TeacherData = res;
    });
  }
  //

  // Start Buy Mat By Code
  subscribeMaterial(id: NgForm) {
    let code: any = prompt("Please enter Code");
    if (code != null) {
      this.spinner.show();
      this.matServ.subscribeMaterial({ materialId: id, code: code }).subscribe(
        (res: any) => {
          this.spinner.hide();
          //console.log("res", res);
          let returnValue = res.returnValue;
          if (returnValue == 0) {
            this.spinner.hide();
            this.toastr.warning("You are not student", "خطاء");
          } else if (returnValue == 1) {
            this.spinner.hide();
            this.toastr.success("تم شراء المحاضره");
            window.location.reload();
          } else if (returnValue == -1) {
            this.spinner.hide();
            this.toastr.warning("الكود الذي أدخلته غير صحيح", "خطاء");
          } else if (returnValue == -5) {
            this.spinner.hide();
            this.toastr.info("تم الشراء من قبل", "خطاء");
          } else if (returnValue == -10) {
            this.spinner.hide();
            this.toastr.warning(res.returnString);
          } else if (returnValue == -55) {
            this.spinner.hide();
            this.toastr.warning(" تم إستخدام الكود من قبل ", "خطاء");
          } else {
            this.toastr.warning(res.returnString);
            this.spinner.hide();
          }
        },
        (err: any) => {
          console.log("err", err);
          this.spinner.hide();
        }
      );
    }
  }
  //

  //Start: Buy Material By Cridet
  buyMaterialById(id: any) {
    let confirmed = confirm("تأكيد عمليه الشراء؟");
    if (confirmed) {
      this.spinner.show();
      this.matServ.buyMaterialByCredit(id).subscribe(
        (res: any) => {
          this.spinner.hide();
          //console.log("res", res)
          let returnValue = res.returnValue;

          if (returnValue == 0) {
            this.spinner.hide();
            this.toastr.warning("You are not student", "خطاء");
          } else if (returnValue == 1) {
            this.spinner.hide();
            this.toastr.success("تم شراء المحاضره");
            this.reloadComponent();
          } else if (returnValue == -1) {
            this.spinner.hide();
            this.toastr.warning("ليس لديك رصيد كافي ", "خطاء");
          } else if (returnValue == -5) {
            this.spinner.hide();
            this.toastr.info("تم الشراء من قبل", "خطاء");
          } else if (returnValue == -10) {
            this.spinner.hide();
            this.toastr.warning(res.returnString, "خطاء");
          } else {
            this.spinner.hide();
            this.toastr.warning(res.returnString, "خطاء");
          }
        },
        (err: any) => {
          console.log("err", err);
          this.spinner.hide();
        }
      );
    }
  }
  //

  //Check if Offline Material Has Online
  CheckifOfflineMaterialHasOnline(lecId: any, buyType: any) {
    this.spinner.show();
    this.matServ
      .CheckifOfflineMaterialHasOnline(lecId)
      .subscribe((res: any) => {
        //console.log(res)
        if (res == true) {
          let confirmed = confirm(
            " لقد قمت بحضور هذه المحاضره في السنتر هل تود الإستمرار؟ "
          );
          if (confirmed) {
            this.spinner.hide();
            if (buyType == 1) {
              // if buy by Credit
              this.buyMaterialById(lecId);
            } else if (buyType == 2) {
              // if buy by code
              this.subscribeMaterial(lecId);
            }
          }
        } else {
          this.spinner.hide();
          if (buyType == 1) {
            // if buy by Credit
            this.buyMaterialById(lecId);
          } else if (buyType == 2) {
            // if buy by code
            this.subscribeMaterial(lecId);
          }
        }
      });
  }
  //

  //Start: buy Template
  buyTemplate(id: any) {
    let confirmed = confirm("تأكيد عمليه الشراء؟");
    if (confirmed) {
      this.spinner.show();
      this.MatServ.buyTemplate(id).subscribe((res: any) => {
        this.spinner.hide();
        // console.log("buy", res)

        if (res.returnValue == 1) {
          this.toastr.success("تم شراء الإمتحان");

          this.GenerateExamFromTemplate(id);
          // let url = "Exam/Details/" + id;
          // window.open(url, "_blank");
        }
        //else if (res.returnValue == 0) {
        //   this.toastr.warning(res.returnString, "خطأ");
        // }
        else if (res.returnValue == 3) {
          this.toastr.warning("ليس لديك رصيد كافي", "خطأ");
        } else {
          this.toastr.warning(res.returnString, "خطأ");
        }
      });
    }
  }
  //

  //Generate Exam From Template By templateId
  GenerateExamFromTemplate(templateId: any) {
    this.spinner.show();
    this.StudentServ.GenerateExamFromTemplate(templateId).subscribe(
      (res: any) => {
        if ((res.returnValue = 200)) {
          let url = "/student/exam/" + res.examId;
          window.open(url, "_blank");
          this.spinner.hide();
        }
        // console.log("gen", res)
      }
    );
  }
  //

  //Start: buy Exam
  buyExam(id: any) {
    let confirmed = confirm("تأكيد عمليه الشراء؟");
    if (confirmed) {
      this.spinner.show();
      this.MatServ.buyExam(id).subscribe((res: any) => {
        //console.log(res)
        this.spinner.hide();

        if (res.returnValue == 1) {
          this.toastr.success("تم شراء الإمتحان");
          // this.reloadComponent();

          // $(`#ex-open-${id}`).show();
          //  $(`#buy-exam-${id}`).hide();
          let url = "/student/exam/" + id;
          window.open(url, "_blank");
        } else if (res.returnValue == 0) {
          this.toastr.warning(res.returnString, "خطأ");
        } else if (res.returnValue == 3) {
          this.toastr.warning("ليس لديك رصيد كافي", "خطأ");
        } else {
          this.toastr.warning(res.returnString, "خطأ");
        }
      });
    }
  }
  //

  // Vimeo IncrementView
  VimeoIncrementView() {
    // Video
    let iframe = document.getElementById("CurruntVideoiframe");
    let Video = new Vimeo.Player(iframe);
    let currentTime: any = -1;
    let percentage: any;

    Video.on("play", () => {
      console.log("video-played");
      //get Video length
      Video.getDuration().then((duration: any) => {
        percentage = Math.floor((this.view_percentage / 100) * duration);
      });

      setInterval(() => {
        Video.getCurrentTime().then((seconds: any) => {
          currentTime = Math.floor(seconds);
          //console.log(currentTime)
        });
        if (currentTime >= percentage && !this.viewDone) {
          this.viewDone = true;
          this.incrementView(this.MatId, this.partId);
        }
      }, 1000);
    });
  }
  //

  //  Sprout IncrementView
  sproutIncrementView() {
    let str = this.lecPath;
    let videoId = str.substring(
      str.lastIndexOf("embed/") + 6,
      str.lastIndexOf("/")
    );
    // var Video = new SV.Player({ videoId: "709adcb31f19e5c6f8" });
    var Video = new SV.Player({ videoId: videoId });
    let currentpercent: any;
    let viewPercentage = this.view_percentage;
    Video.play();

    Video.bind("progress", (e: any) => {
      currentpercent = Math.floor(e.data.percent * 100);
      //console.log('e', currentpercent);
      if (currentpercent >= viewPercentage && !this.viewDone) {
        this.viewDone = true;
        this.incrementView(this.MatId, this.partId);
      }
    });
  } //End

  // Create View Row
  createViewRow() {
    this.spinner.show();
    return this.matServ
      .createViewRow(this.MatId, this.partId)
      .subscribe((res: any) => {
        this.spinner.hide();
        //console.log(res);
        if (res.returnValue == 1) {
          // row Created Success
        } else if (res.returnValue != 1) {
          console.log(res.returnString);
        }
      });
  }
  //#endregion

  playiframevid() {
    if (this.ExamsSolved) {
      this.VideoReady = true;
      this.createViewRow();
      let found = this.lecPath;
      let sprout = found.search("sproutvideo");
      let vimeo = found.search("vimeo");

      if (vimeo != -1) {
        // (vimeo)
        this.VimeoIncrementView();
      } else if (sprout != -1) {
        // (sprout)
        this.sproutIncrementView();
      }
    } else this.toastr.warning("Please check your exams");

    //If Attached Exams
    this.checkTemps();
    //If Attached Templates
    this.checkExame();
  }

  // increment View +1
  incrementView(matId: any, partId: any) {
    // this.spinner.show();
    return this.matServ.incrementView(matId, partId).subscribe((res: any) => {
      this.spinner.hide();
      //console.log(res);
      if (res.returnValue == 1) {
        this.viewDone = true;
        //this.toastr.info('done');
        console.log("Views Added ");
      } else if (res.returnValue != 1) {
        console.log(res.returnString);
        this.viewDone = false;
      }
    });
  }

  //#region  check If  any Attached Exams
  checkExame() {
    // If Attached Exams
    if (this.AttachedExams.length > 0) {
      let j = this.AttachedExams.length;
      for (let i = 0; i <= j; i++) {
        // Exams Not purchased and Not Free
        if (
          !this.AttachedExams[i]?.Purchased &&
          this.AttachedExams[i]?.price > 0
        ) {
          let msg =
            'تأكد من شراء الإمتحان " ' +
            this.AttachedExams[i]?.exam_ar_name +
            ' " اولاً';
          this.toastr.warning(msg, "خطاَ");
          this.examsReady = false;
        }

        // IF Exam Purchased or Free
        else if (
          this.AttachedExams[i]?.Purchased ||
          this.AttachedExams[i]?.price == 0
        ) {
          // 1- Exam Unsolved
          if (this.AttachedExams[i]?.studentMark == -1) {
            let msg =
              'تأكد من حل الإمتحان  " ' +
              this.AttachedExams[i]?.exam_ar_name +
              ' " ';
            this.toastr.warning(msg, "خطاَ");
            this.examsReady = false;
          }

          // 2- Exam  Solved
          else if (this.AttachedExams[i]?.studentMark != -1) {
            // Required Mark To Pass
            if (
              this.AttachedExams[i]?.requiredMarkToPass !== 0 ||
              this.AttachedExams[i]?.requiredMarkToPass !== null
            ) {
              // requiredMarkToPass>studentMark
              if (
                this.AttachedExams[i]?.requiredMarkToPass >
                this.AttachedExams[i]?.studentMark
              ) {
                let msg =
                  'تأكد من الحصول علي الدرجه المطلوبه للنجاح في " ' +
                  this.AttachedExams[i]?.exam_ar_name +
                  ' " ';
                this.toastr.warning(msg, "خطاَ");
                this.examsReady = false;
              } //studentMark > requiredMarkToPass
              else {
                // Exams Ready to open video
                this.examsReady = true;
              }
            } else {
              // Exams Ready to open video
              this.examsReady = true;
            }
          }
        }
      } // end For
    }
  } // End checkExame()

  checkTemps() {
    if (this.AttachedTemplates.length > 0) {
      let j = this.AttachedTemplates.length;
      for (let i = 0; i <= j; i++) {
        // Temp Not purchased and Not Free
        if (
          !this.AttachedTemplates[i]?.Purchased &&
          this.AttachedTemplates[i]?.price > 0
        ) {
          let msg =
            'تأكد من شراء الإمتحان " ' +
            this.AttachedTemplates[i]?.Name +
            ' " اولاً';
          this.toastr.warning(msg, "خطاَ");
          this.tempsReady = false;
        }

        // IF Temp Purchased or Free
        else if (
          this.AttachedTemplates[i]?.Purchased ||
          this.AttachedTemplates[i]?.price == 0
        ) {
          // 1- Temp Unsolved
          if (this.AttachedTemplates[i]?.studentMark == -1) {
            let msg =
              'تأكد من حل الإمتحان  " ' +
              this.AttachedTemplates[i]?.Name +
              ' " ';
            this.toastr.warning(msg, "خطاَ");
            this.tempsReady = false;
          }

          // 2- Temp  Solved
          else if (this.AttachedTemplates[i]?.studentMark >= 0) {
            // Required Mark To Pass
            if (
              this.AttachedTemplates[i]?.requiredMarkToPass != null ||
              this.AttachedTemplates[i]?.requiredMarkToPass != 0
            ) {
              // requiredMarkToPass>studentMark
              if (
                this.AttachedTemplates[i]?.requiredMarkToPass >
                this.AttachedTemplates[i]?.studentMark
              ) {
                let msg =
                  'تأكد من الحصول علي الدرجه المطلوبه للنجاح في " ' +
                  this.AttachedTemplates[i]?.Name +
                  ' " ';
                this.toastr.warning(msg, "خطاَ");
                this.tempsReady = false;
              }
              //studentMark > requiredMarkToPass
              else {
                // Exams Ready to open video
                this.tempsReady = true;
              }
            } else {
              // Exams Ready to open video
              this.tempsReady = true;
            }
          }
        }
      } // end For
    } //end if temp length>0
  } // End checkTemps()

  // Reload  Current Component
  reloadComponent() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = "reload";
    this.router.navigate([currentUrl]);
  }
} // end class PaidComponent
