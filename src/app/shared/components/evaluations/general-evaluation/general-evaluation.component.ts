import { Component, OnInit } from "@angular/core";
import { Chart } from "app/shared/models/general/apexcharts";
import { GeneralEvaluation } from "app/student/models/generalEvaluation";
import { StudentService } from "app/student/services/student.service";
const data = {
  WidgetlineDashboard2Chart: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug"],
    series: [[55, 60, 50, 55, 50, 60, 55, 57]],
  },
};

@Component({
  selector: "app-general-evaluation",
  templateUrl: "./general-evaluation.component.html",
  styleUrls: ["./general-evaluation.component.scss"],
})
export class GeneralEvaluationComponent implements OnInit {
  GeneralEvaluation: GeneralEvaluation;
  presentage?: number;

  constructor(private StudentServ: StudentService) {}

  ngOnInit(): void {
    this.returnGeneralEvaluation();
  }

  // Return Student General Evaluation
  returnGeneralEvaluation() {
    this.StudentServ.returnGeneralEvaluation<GeneralEvaluation>().subscribe(
      (res) => {
        this.GeneralEvaluation = res;
        this.presentage =
          (res.studentGrades / (res.examGrades != 0 ? res.examGrades : 1)) *
          100;
      }
    );
  }

  WidgetlineChart: Chart = {
    type: "Line",
    data: data["WidgetlineDashboard2Chart"],
    options: {
      axisX: {
        showGrid: false,
        showLabel: false,
        offset: 0,
      },
      axisY: {
        showGrid: false,
        low: 50,
        showLabel: false,
        offset: 0,
      },
      fullWidth: true,
    },
  };

  onResized(event: any) {
    setTimeout(() => {
      this.fireRefreshEventOnWindow();
    }, 300);
  }

  fireRefreshEventOnWindow = function () {
    var evt = document.createEvent("HTMLEvents");
    evt.initEvent("resize", true, false);
    window.dispatchEvent(evt);
  };
}
