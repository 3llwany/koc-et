import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { IRowFunctionVM } from 'app/shared/models/general/general';
import { AuthService } from 'app/shared/services/auth/auth.service';
import { ExamsService } from "app/admin/services/Admin/exams.service";
import { NgxSpinnerService } from "ngx-spinner";
import { ICorrectionQuestionViewModel } from 'app/admin/models/admin/exam';
import { CorrectionDialogComponent } from '../correction-dialog/correction-dialog.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-correction-index',
  templateUrl: './correction-index.component.html',
  styleUrls: ['./correction-index.component.css']
})
export class CorrectionIndexComponent implements OnInit {
  myForm!: FormGroup;
  functionId: number;
  EduCompId: any;
  itemsCount: any;
  
  correction:ICorrectionQuestionViewModel[]=[];
  displayedColumns: string[] = [
     "examName",
  "questionName",
     "teacherName",
    "actions",
  ];
  rowFunctions: IRowFunctionVM[];
  get page() {
    return this.myForm.get("page");
  }
  get CorrectedQuestionsIdCtrl() {
    return this.myForm.get("CorrectedQuestions");
  }
  dataSource: MatTableDataSource<IRowFunctionVM>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private examService: ExamsService,
    private route: ActivatedRoute,
    private authserv: AuthService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private dialog: MatDialog,

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
    this.myForm = this.fb.group({
      page: [""],
      EduCompId: [this.EduCompId],
      CorrectedQuestions:[1]
    });
//this.openCorrectDialog();
this.getAllQuestions(1,1);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllQuestions(p: number,CorrectedQuestions: number) {
    this.myForm.controls["page"]?.setValue(p);
   // this.myForm.controls["CorrectedQuestions"].value;
    this.spinner.show();
    this.examService.getQuestionByCorrectionType(p, CorrectedQuestions).subscribe((response: any) => {
      if (response) {
          console.log('quesions not corrected: ', response.examsList);
          this.correction=response.examsList.examQuestions;

          console.log("correct list",this.correction);
          
       //   this.question=response.examsList.examQuestions;
        this.dataSource = new MatTableDataSource(response.examsList);
        // this.correction = response.examList;
         this.itemsCount = response.itemsCount;
         this.spinner.hide();
      }
      
    });
  }

  openCorrectDialog(item :ICorrectionQuestionViewModel): void {
    this.dialog
      .open(CorrectionDialogComponent, {
        data: {
          msg: item,
        },
      })
      .afterClosed()
      .subscribe((confirm) => {
        if (confirm) console.log("dialog");
      });
  }

}
