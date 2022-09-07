import { AddTemplateComponent } from "./templates/add-template/add-template.component";
import { AddQuestionComponent } from "./questions-banck/add-question/add-question.component";
import { QuestionsIndexComponent } from "./questions-banck/questions-index/questions-index.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsAdminGuard } from "app/shared/services/auth/Guards/roles/is-admin.guard";
import { AddExamComponent } from "./exams/add-exam/add-exam.component";
import { ExamsIndexComponent } from "./exams/exams-index/exams-index.component";
import { TemplatesIndexComponent } from "./templates/templates-index/templates-index.component";
import { CorrectionIndexComponent } from "./exam-correction/correction-index/correction-index.component";

const routes: Routes = [
  {
    path: "",
    redirectTo: "exams-index",
    pathMatch: "full",
  },

  {
    path: "exams-index",
    component: ExamsIndexComponent,
  },

  {
    path: "add-exam",
    component: AddExamComponent,
  },

  {
    path: "question-bank",
    children: [
      {
        path: "",
        redirectTo: "index",
        pathMatch: "full",
      },
      {
        path: "index",
        component: QuestionsIndexComponent,
      },
      {
        path: "add-question",
        component: AddQuestionComponent,
      },
    ],
  },

  {
    path: "templates",
    children: [
      { path: "", redirectTo: "index", pathMatch: "full" },
      { path: "index", component: TemplatesIndexComponent },
      { path: "add-template", component: AddTemplateComponent },
    ],
  },
  {
    path: "exam-correction",
    children: [
      { path: "", redirectTo: "index", pathMatch: "full" },
      { path: "index", component: CorrectionIndexComponent },
     // { path: "add-template", component: AddTemplateComponent },
    ],
  },
  // { path: "templates-index", component: TemplatesIndexComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamsRoutingModule {}
