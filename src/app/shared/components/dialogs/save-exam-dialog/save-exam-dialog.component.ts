import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-save-exam-dialog",
  templateUrl: "./save-exam-dialog.component.html",
  styleUrls: ["./save-exam-dialog.component.scss"],
})
export class SaveExamDialogComponent implements OnInit {
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    console.log(data);
  }

  ngOnInit() {}
}
