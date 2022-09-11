import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ExamsRoutingModule } from "./exams-routing.module";
import { ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "app/shared/shared.module";
import { MaterialModule } from "app/shared/material/material.module";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { AddExamComponent } from "./exams/add-exam/add-exam.component";
import { NgxPaginationModule } from "ngx-pagination";
import { QuestionsIndexComponent } from "./questions-banck/questions-index/questions-index.component";
import { AddQuestionComponent } from "./questions-banck/add-question/add-question.component";
import { ExamsIndexComponent } from "./exams/exams-index/exams-index.component";
import { AddSubQuestionComponent } from "./exams/add-sub-question/add-sub-question.component";
import { TemplatesIndexComponent } from "./templates/templates-index/templates-index.component";
import { AddTemplateComponent } from './templates/add-template/add-template.component';
import { CorrectionIndexComponent } from "./exam-correction/correction-index/correction-index.component";
import { CorrectionDialogComponent } from "./exam-correction/correction-dialog/correction-dialog.component";

@NgModule({
  declarations: [
    ExamsIndexComponent,
    AddExamComponent,
    AddSubQuestionComponent,
    QuestionsIndexComponent,
    AddQuestionComponent,
    TemplatesIndexComponent,
    AddTemplateComponent,
    CorrectionIndexComponent,
    CorrectionDialogComponent
  ],
  imports: [
    ExamsRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    NgbModule,
    NgxSpinnerModule,
    NgxPaginationModule,
  ],
})
export class ExamsModule {}
