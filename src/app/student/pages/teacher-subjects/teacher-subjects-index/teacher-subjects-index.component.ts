import { NgxSpinnerModule } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { IStudentReservationVM } from "app/admin/models/admin/reservation";
import { ReservationService } from "app/admin/services/Admin/reservation.service";
import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import { ToastrService } from "ngx-toastr";
import { NgxSpinnerService } from "ngx-spinner";
import {
  ITeacherSubjectsListVM,
  ITeacherSubjectsVM,
} from "app/student/models/student";

@Component({
  selector: "app-teacher-subjects-index",
  templateUrl: "./teacher-subjects-index.component.html",
  styleUrls: ["./teacher-subjects-index.component.scss"],
})
export class TeacherSubjectsIndexComponent implements OnInit {
  teacherSubjects: ITeacherSubjectsListVM[] = [];
  teacherId: any;
  Reservations?: IStudentReservationVM;
  constructor(
    private TeacherSubServ: TeacherSubjectsService,
    private router: Router,
    private route: ActivatedRoute,
    private toaster: ToastrService,
    private ReservationService: ReservationService,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe(
      (params) => (this.teacherId = params.get("teacherId"))
    );
  }

  ngOnInit(): void {
    this.getReservationInfo();
    this.returnTeacherSubjects(this.teacherId);
  }

  //Start Return Home Teachers
  returnTeacherSubjects(teacherId: any) {
    this.spinner.show();
    this.TeacherSubServ.ReturnTeacherSubjects<ITeacherSubjectsVM>({
      //teacherUserId: teacherId,
      teacherID: teacherId,
    }).subscribe((res) => {
      this.teacherSubjects = res.list_teachersubject_has_material_or_exam;
      //IF teacher have one subject redirect to subject lectures
      let subCount = res.list_teachersubject_has_material_or_exam?.length;
      if (subCount === 1) {
        let lec = res.list_teachersubject_has_material_or_exam[0];

        let subject_id = lec.subject_id;

        let teacher_subject_id = lec.teacher_subject_id;

        if (this.teacherId == "17" || this.teacherId == 150) {
          //If Techer Tamer ElQady or mohamed galal go to subjects list
          this.router.navigateByUrl("/student/teacher/" + this.teacherId);
        } else {
          // if any teacher go to teacher subject profile
          this.router.navigateByUrl(
            "/student/teacher/" +
              this.teacherId +
              "/teacher-subject/" +
              teacher_subject_id +
              "/" +
              subject_id
          );
        }
        this.spinner.hide();
      }
    });
  }

  getReservationInfo() {
    this.ReservationService.getReservationInfo<IStudentReservationVM>(
      2
    ).subscribe((res) => {
      //console.log("getCurrentReservation", res);
      this.Reservations = res;
    });
  }
}
