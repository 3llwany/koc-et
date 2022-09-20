import { Component, OnInit } from "@angular/core";
import { subject } from "app/admin/models/admin/educations";
import { StudentService } from "app/student/services/student.service";

@Component({
  selector: "app-my-subjects",
  templateUrl: "./my-subjects.component.html",
  styleUrls: ["./my-subjects.component.scss"],
})
export class MySubjectsComponent implements OnInit {
  mySubjects?: subject[] = [];

  constructor(private StudentServ: StudentService) {}

  ngOnInit(): void {
    //  this.returnStudentSubjects();
  }

  //Start Return Student Subject List
  returnStudentSubjects() {
    this.StudentServ.returnStudentSubjects().subscribe((res: any) => {
      this.mySubjects = res.mainSubjects;
    });
  }
}
