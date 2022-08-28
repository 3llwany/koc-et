import { CreateExamComponent } from "./pages/create-exam/create-exam.component";
import { EducationalStageComponent } from "./pages/educational-stage/educational-stage.component";
import { JoinToGroupComponent } from "./pages/reservation/join-to-group/join-to-group.component";
import { ReservationSubmitComponent } from "./pages/reservation/reservation-submit/reservation-submit.component";
import { AcademyServicesComponent } from "./pages/reservation/academy-services/academy-services.component";
import { ExamPageComponent } from "./pages/materials/exam-page/exam-page.component";
import { VideoPageComponent } from "./pages/materials/video-page/video-page.component";
import { BalanceRechargeComponent } from "./pages/Balance/balance-recharge/balance-recharge.component";
import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MySpaceComponent } from "./pages/my-space/my-space.component";
import { TeacherSubjectProfileComponent } from "./pages/teacher-subjects/teacher-subject-profile/teacher-subject-profile.component";
import { TeacherSubjectsIndexComponent } from "./pages/teacher-subjects/teacher-subjects-index/teacher-subjects-index.component";
import { PoliciesComponent } from "./pages/reservation/policies/policies.component";
import { SubjectEvaluationComponent } from "app/shared/components/evaluations/subject-evaluation/subject-evaluation.component";
import { RefundStudentLectureComponent } from "./pages/refund-student-lecture/refund-student-lecture.component";
import { PendingChangesGuard } from "app/shared/services/auth/Guards/auth/pending-changes.guard";
import { StudentChatComponent } from "app/student/pages/chat/student-chat.component";

const routes: Routes = [
  { path: "", redirectTo: "mySpace", pathMatch: "full" },

  {
    path: "mySpace",
    component: MySpaceComponent,
  },

  {
    path: "recharge",
    component: BalanceRechargeComponent,
  },

  {
    path: "subject-evaluation/:subjectId",
    component: SubjectEvaluationComponent,
  },

  {
    path: "educational-stage",
    component: EducationalStageComponent,
  },

  {
    path: "refund-lecture",
    component: RefundStudentLectureComponent,
  },

  {
    path: "create-exam",
    component: CreateExamComponent,
  },

  // teacher subject data
  {
    path: "teacher/:teacherId",
    children: [
      { path: "", redirectTo: "subjects-index", pathMatch: "full" },
      { path: "subjects-index", component: TeacherSubjectsIndexComponent },
      {
        path: "teacher-subject/:teacherSubjectId/:subjectId",
        component: TeacherSubjectProfileComponent,
      },
      {
        path: "teacher-subject/:teacherSubjectId/:subjectId",
        children: [
          { path: "material/:materialId", component: VideoPageComponent },
        ],
      },
    ],
  },

  {
    path: "exam/:examId",
    component: ExamPageComponent,
    canDeactivate: [PendingChangesGuard],
  },
  {
    path: "chat/:teacherSubjectId",
    component: StudentChatComponent,
  },

  {
    path: "reservation/:teacherId/:EduCompId/:viewId/:code/:currentYear",
    children: [
      { path: "", redirectTo: "services", pathMatch: "full" },
      { path: "services", component: AcademyServicesComponent },
      { path: "policies", component: PoliciesComponent },
      { path: "submit", component: ReservationSubmitComponent },
      { path: "confirm-reservation", component: JoinToGroupComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
