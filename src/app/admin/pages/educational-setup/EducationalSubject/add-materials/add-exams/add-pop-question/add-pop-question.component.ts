import { Component, Input, OnInit } from "@angular/core";

@Component({
  selector: "app-add-pop-question",
  templateUrl: "./add-pop-question.component.html",
  styleUrls: ["./add-pop-question.component.scss"],
})
export class AddPopQuestionComponent implements OnInit {
  @Input("materialId") materialId: any;
  constructor() {}

  ngOnInit(): void {}
}
