import { AddQuestionComponent } from "./questions-banck/add-question/add-question.component";
import { QuestionsIndexComponent } from "./questions-banck/questions-index/questions-index.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { IsAdminGuard } from "app/shared/services/auth/Guards/roles/is-admin.guard";
import { AddExamComponent } from "./exams/add-exam/add-exam.component";
import { ExamsIndexComponent } from "./exams/exams-index/exams-index.component";

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
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExamsRoutingModule {}
