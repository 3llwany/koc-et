import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { IMyTeachersMV, ITeachersListMV } from "app/student/models/student";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-my-teachers",
  templateUrl: "./my-teachers.component.html",
  styleUrls: ["./my-teachers.component.scss"],
})
export class MyTeachersComponent implements OnInit {
  myTeachers: ITeachersListMV[];
  othersTeachers: ITeachersListMV[];

  constructor(
    private TeacherSubjectsService: TeacherSubjectsService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getMyTeachers();
  }

  getMyTeachers() {
    this.spinner.show();
    this.TeacherSubjectsService.getMyTeachers<IMyTeachersMV>().subscribe(
      (res) => {
        //console.log(res);
        this.myTeachers = res.userTeachers;
        this.othersTeachers = res.otherTeachers;
        this.spinner.hide();
      }
    );
  }
}
