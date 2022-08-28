import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-policies",
  templateUrl: "./policies.component.html",
  styleUrls: ["./policies.component.scss"],
})
export class PoliciesComponent implements OnInit {
  isReaded: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
