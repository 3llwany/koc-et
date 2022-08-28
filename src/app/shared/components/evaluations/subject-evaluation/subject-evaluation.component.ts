import { NgxSpinnerService } from "ngx-spinner";
import {
  Component,
  ElementRef,
  OnInit,
  QueryList,
  ViewChild,
  ViewChildren,
} from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { StudentService } from "app/student/services/student.service";
import {
  IEvaluationMaterialsVM,
  ISubjectEvaluationVM,
} from "app/student/models/student";

@Component({
  selector: "app-subject-evaluation",
  templateUrl: "./subject-evaluation.component.html",
  styleUrls: ["./subject-evaluation.component.scss"],
})
export class SubjectEvaluationComponent implements OnInit {
  subjectId: number;
  achievments: number = 0;
  Exams: ISubjectEvaluationVM;
  Materials: IEvaluationMaterialsVM;

  constructor(
    private StudentServ: StudentService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.subjectId = Number(params.get("subjectId"));
      if (this.subjectId) {
        this.returnStudentSubjectEvaluation(this.subjectId);
        this.getSubjectMaterials();
      }
    });
  }

  ngOnInit(): void {}

  returnStudentSubjectEvaluation(subjectId: any) {
    this.spinner.show();
    this.StudentServ.returnSubjectEvaluation<ISubjectEvaluationVM>(
      subjectId
    ).subscribe((res: any) => {
      this.Exams = res;
      //console.log("SubjectEvaluation", res);
      this.achievments =
        res?.studentGrades == 0
          ? 0
          : (res?.studentGrades / res?.examGrades) * 100;
      this.spinner.hide();
    });
  }

  getSubjectMaterials() {
    this.spinner.show();
    this.StudentServ.getSubjectMaterials<IEvaluationMaterialsVM>(
      this.subjectId
    ).subscribe((res: any) => {
      // console.log("SubjectMaterials", res);
      this.Materials = res;
      this.spinner.hide();
    });
  }
}
