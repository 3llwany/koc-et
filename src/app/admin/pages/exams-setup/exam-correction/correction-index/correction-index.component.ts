import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IRowFunctionVM } from 'app/shared/models/general/general';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { NgxSpinnerService } from "ngx-spinner";
@Component({
  selector: 'app-correction-index',
  templateUrl: './correction-index.component.html',
  styleUrls: ['./correction-index.component.css']
})
export class CorrectionIndexComponent implements OnInit {
  myForm!: FormGroup;
  functionId: number;
  EduCompId: any;
  displayedColumns: string[] = [
    "questionId",
    "questionName",
    "teacher",
    "actions",
  ];
  rowFunctions: IRowFunctionVM[];
  dataSource: MatTableDataSource<IRowFunctionVM>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private route: ActivatedRoute,
    private authserv: AuthService,
  ) { 
    route.queryParamMap.subscribe((params) => {
      this.functionId = Number(params.get("functionId"));
      //  console.log("functionId", this.functionId);
      if (this.functionId) {
        this.authserv
          .getUserRowFunctions(this.functionId)
          .subscribe((res: any) => {
            if (res) {
              this.rowFunctions = res;
              //  console.log(`RowFunctions for"${this.functionId}": `, res);
            }
          });
      }
    });
  }

  ngOnInit() {
    this.EduCompId = this.authserv.getEduCompId();
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

}
