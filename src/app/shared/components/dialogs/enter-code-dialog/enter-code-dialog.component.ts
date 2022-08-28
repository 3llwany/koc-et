import { Component, Inject, OnInit } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";

@Component({
  selector: "app-enter-code-dialog",
  templateUrl: "./enter-code-dialog.component.html",
  styleUrls: ["./enter-code-dialog.component.scss"],
})
export class EnterCodeDialogComponent implements OnInit {
  code: string;
  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {}

  ngOnInit(): void {}
}
