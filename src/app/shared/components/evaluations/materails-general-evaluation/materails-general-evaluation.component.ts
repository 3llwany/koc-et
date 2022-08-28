import { NgxSpinnerService } from "ngx-spinner";
import { Component, OnInit } from "@angular/core";
import { Chart } from "app/shared/models/general/apexcharts";
import { StudentService } from "app/student/services/student.service";
import * as Chartist from "chartist";
const a = {
  line2: {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    series: [
      [160, 150, 140, 120, 75, 35, 45, 65, 100, 145, 160, 180],
      [100, 95, 90, 100, 110, 120, 130, 140, 130, 95, 75, 80],
    ],
  },
};
@Component({
  selector: "app-materails-general-evaluation",
  templateUrl: "./materails-general-evaluation.component.html",
  styleUrls: ["./materails-general-evaluation.component.scss"],
})
export class MaterailsGeneralEvaluationComponent implements OnInit {
  subjectsEvaluation: any[] = [];
  presentage?: number;
  labels: any = [];
  series: any[] = [];
  data = {
    line2: {
      labels: [this.labels],
      series: [[160, 150, 140, 120, 75, 35, 45, 65, 100, 145, 160, 180]],
    },
  };

  constructor(
    private StudentServ: StudentService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.returnGeneralEvaluation();
  }

  // Return Student General Evaluation
  returnGeneralEvaluation() {
    this.spinner.show();
    this.StudentServ.returnGeneralEvaluation<any>().subscribe((res) => {
      this.subjectsEvaluation = res.subjectsCountList;
      //  console.log(res);
      for (const obj of this.subjectsEvaluation) {
        // this.labels += `"${obj.subject_ar_name}",`;
        this.labels.push(obj.subject_ar_name);
      }
      //  console.log("labels", this.labels);
    });
    this.spinner.show();
  }

  // Line chart configuration Starts
  lineChart2: Chart = {
    type: "Line",
    data: this.data["line2"],
    options: {
      axisX: {
        showGrid: false,
      },
      axisY: {
        low: 0,
        scaleMinSpace: 20,
      },
      fullWidth: true,
    },
    responsiveOptions: [
      [
        "screen and (max-width: 640px) and (min-width: 381px)",
        {
          axisX: {
            labelInterpolationFnc: function (value, index) {
              return index % 2 === 0 ? value : null;
            },
          },
        },
      ],
      [
        "screen and (max-width: 380px)",
        {
          axisX: {
            labelInterpolationFnc: function (value, index) {
              return index % 3 === 0 ? value : null;
            },
          },
        },
      ],
    ],
    events: {
      draw(data: any): void {
        var circleRadius = 6;
        if (data.type === "point") {
          var circle = new Chartist.Svg("circle", {
            cx: data.x,
            cy: data.y,
            r: circleRadius,
            class: "ct-point-circle",
          });
          data.element.replace(circle);
        } else if (data.type === "label") {
          // adjust label position for rotation
          const dX = data.width / 2 + (30 - data.width);
          data.element.attr({ x: data.element.attr("x") - dX });
        }
      },
    },
  };
}
