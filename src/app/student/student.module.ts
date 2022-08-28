import { NgxPaginationModule } from "ngx-pagination";
import { TranslateService } from "@ngx-translate/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { NgModule } from "@angular/core";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { NgxSpinnerModule } from "ngx-spinner";
import { MySubjectsComponent } from "./pages/my-subjects/my-subjects.component";
import { CommonModule } from "@angular/common";

import { StudentRoutingModule } from "./student-routing.module";
import { MaterialModule } from "app/shared/material/material.module";
import { MySpaceComponent } from "./pages/my-space/my-space.component";
import { SharedModule } from "app/shared/shared.module";
import { MyTeachersComponent } from "./pages/my-teachers/my-teachers.component";
import { TeacherSubjectsIndexComponent } from "./pages/teacher-subjects/teacher-subjects-index/teacher-subjects-index.component";
import { TeacherSubjectProfileComponent } from "./pages/teacher-subjects/teacher-subject-profile/teacher-subject-profile.component";
import { VideosLecturesComponent } from "./pages/teacher-subjects/videos-lectures/videos-lectures.component";
import { OfflineLecturesComponent } from "./pages/teacher-subjects/offline-lectures/offline-lectures.component";
import { LiveLecturesComponent } from "./pages/teacher-subjects/live-lectures/live-lectures.component";
import { ReturnSubjectExamsComponent } from "./pages/teacher-subjects/return-subject-exams/return-subject-exams.component";
import { BalanceRechargeComponent } from "./pages/Balance/balance-recharge/balance-recharge.component";
import { PoliciesComponent } from "./pages/reservation/policies/policies.component";
import { ReservationSubmitComponent } from "./pages/reservation/reservation-submit/reservation-submit.component";
import { AcademyServicesComponent } from "./pages/reservation/academy-services/academy-services.component";
import { JoinToGroupComponent } from "./pages/reservation/join-to-group/join-to-group.component";
import { VideoPageComponent } from "./pages/materials/video-page/video-page.component";
import { ExamPageComponent } from "./pages/materials/exam-page/exam-page.component";
import { StudentPaymentsComponent } from "./pages/Balance/student-payments/student-payments.component";
import { StudentPaymentsHistoryComponent } from "./pages/Balance/student-payments-history/student-payments-history.component";
import { ConfirmReservationDialogComponent } from "./pages/reservation/confirm-reservation-dialog/confirm-reservation-dialog.component";
import { EducationalStageComponent } from "./pages/educational-stage/educational-stage.component";
import { RefundStudentLectureComponent } from "./pages/refund-student-lecture/refund-student-lecture.component";
import { CreateExamComponent } from "./pages/create-exam/create-exam.component";
import { StudentChatComponent } from "./pages/chat/student-chat.component";

@NgModule({
  declarations: [
    MySpaceComponent,
    MyTeachersComponent,
    MySubjectsComponent,
    TeacherSubjectsIndexComponent,
    TeacherSubjectProfileComponent,
    VideosLecturesComponent,
    OfflineLecturesComponent,
    LiveLecturesComponent,
    ReturnSubjectExamsComponent,
    BalanceRechargeComponent,
    PoliciesComponent,
    ReservationSubmitComponent,
    AcademyServicesComponent,
    JoinToGroupComponent,
    VideoPageComponent,
    ExamPageComponent,
    StudentPaymentsComponent,
    StudentPaymentsHistoryComponent,
    ConfirmReservationDialogComponent,
    EducationalStageComponent,
    RefundStudentLectureComponent,
    CreateExamComponent,
    StudentChatComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StudentRoutingModule,
    SharedModule,
    MaterialModule,
    NgbModule,
    NgxSpinnerModule,
    NgxPaginationModule,
  ],
  exports: [
    MySpaceComponent,
    MyTeachersComponent,
    MySubjectsComponent,
    TeacherSubjectsIndexComponent,
    TeacherSubjectProfileComponent,
    VideosLecturesComponent,
    OfflineLecturesComponent,
    LiveLecturesComponent,
  ],
})
export class StudentModule {}
