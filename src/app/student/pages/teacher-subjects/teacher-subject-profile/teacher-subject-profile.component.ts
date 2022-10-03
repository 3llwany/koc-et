import { IMaterialVM } from "./../../../../admin/models/admin/educations";
import { StudentService } from "app/student/services/student.service";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import {
  IFileDocumentVM,
  ITeacherDataPostVM,
  ITeacherDataVM,
  ITeacherSubjectFilesVM,
  ITopExamStudentsVM,
  ITopStudentsVM,
} from "app/student/models/student";

@Component({
  selector: "app-teacher-subject-profile",
  templateUrl: "./teacher-subject-profile.component.html",
  styleUrls: ["./teacher-subject-profile.component.scss"],
})
export class TeacherSubjectProfileComponent implements OnInit {
  TeacherData?: ITeacherDataVM;
  TopStudentsList: ITopStudentsVM[] = [];
  TopExamStudentsList: ITopExamStudentsVM[] = [];
  FilesList?: IMaterialVM[] = [];
  teacherId: number;
  subjectId: number;
  teacherSubjectId: number;
  EduCompId: number;
  isChapter: boolean = true;

  constructor(
    private TeacherSubServ: TeacherSubjectsService,
    private route: ActivatedRoute,
    private router: Router,
    private StudentService: StudentService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.teacherId = Number(params.get("teacherId"));
      this.subjectId = Number(params.get("subjectId"));
      this.teacherSubjectId = Number(params.get("teacherSubjectId"));
    });
  }

  ngOnInit(): void {
    this.ReturnTeacherData(this.subjectId, this.teacherId);
    this.ReturneFilesList();
  }

  ReturnTeacherData(subject_id: any, teacher_ID: any) {
    let data: ITeacherDataPostVM = {
      subject_id: subject_id,
      teacherUserId: teacher_ID,
    };
    this.TeacherSubServ.ReturnTeacherData<ITeacherDataVM, ITeacherDataPostVM>(
      data
    ).subscribe((res) => {
      this.TeacherData = res[0];
      this.EduCompId = res[0]?.EduCompId;
      if (this.teacherId == 17) {
        this.GetTopStudents(res[0].EduCompId, this.teacherId, this.subjectId);
        this.GetTopExamStudents(res[0].EduCompId, this.teacherId);
      }
    });
  }

  ReturneFilesList() {
    let data: ITeacherSubjectFilesVM = {
      //teacher: this.teacherId,
      teacherUserId: this.teacherId,
      subject: this.subjectId,
      teacher_subject: this.teacherSubjectId,
    };
    this.TeacherSubServ.ReturneFilesList<
      IFileDocumentVM,
      ITeacherSubjectFilesVM
    >(data).subscribe((res) => {
      //console.log("List", res);
      this.FilesList = res.materialsList;
    });
  }

  GetTopStudents(EduCompId: any, TeacherId: any, SubjectId: any) {
    this.StudentService.GetTopStudents<ITopStudentsVM[]>(
      EduCompId,
      TeacherId,
      SubjectId
    ).subscribe((res) => {
      this.TopStudentsList = res;
      console.log("GetTopStudents", res);
    });
  }

  GetTopExamStudents(EduCompId: any, TeacherId: any) {
    this.StudentService.GetTopExamStudents<ITopExamStudentsVM[]>(
      EduCompId,
      TeacherId
    ).subscribe((res) => {
      this.TopExamStudentsList = res;
      console.log("GetTopExamStudents", res);
    });
  }
}
