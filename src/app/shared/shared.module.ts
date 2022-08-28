import { NgxPaginationModule } from "ngx-pagination";
import { NgxSpinnerModule } from "ngx-spinner";
import { SaveExamDialogComponent } from "./components/dialogs/save-exam-dialog/save-exam-dialog.component";
import { MaterialModule } from "app/shared/material/material.module";
import { NgApexchartsModule } from "ng-apexcharts";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { OverlayModule } from "@angular/cdk/overlay";

import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { TranslateModule } from "@ngx-translate/core";
import { PerfectScrollbarModule } from "ngx-perfect-scrollbar";
import { ClickOutsideModule } from "ng-click-outside";

import { AutocompleteModule } from "./components/autocomplete/autocomplete.module";
import { PipeModule } from "app/shared/pipes/pipe.module";

//COMPONENTS
import { FooterComponent } from "./footer/footer.component";
import { NavbarComponent } from "./navbar/navbar.component";
import { VerticalMenuComponent } from "./vertical-menu/vertical-menu.component";
import { CustomizerComponent } from "./customizer/customizer.component";
import { NotificationSidebarComponent } from "./notification-sidebar/notification-sidebar.component";

//DIRECTIVES
import { ToggleFullscreenDirective } from "./directives/toggle-fullscreen.directive";
import { SidebarLinkDirective } from "./directives/sidebar-link.directive";
import { SidebarDropdownDirective } from "./directives/sidebar-dropdown.directive";
import { SidebarAnchorToggleDirective } from "./directives/sidebar-anchor-toggle.directive";
import { SidebarDirective } from "./directives/sidebar.directive";
import { TopMenuDirective } from "./directives/topmenu.directive";
import { TopMenuLinkDirective } from "./directives/topmenu-link.directive";
import { TopMenuDropdownDirective } from "./directives/topmenu-dropdown.directive";
import { TopMenuAnchorToggleDirective } from "./directives/topmenu-anchor-toggle.directive";
import { GeneralEvaluationComponent } from "./components/evaluations/general-evaluation/general-evaluation.component";
import { ChartistModule } from "ng-chartist";
import { MyAppretiationComponent } from "./components/my-appretiation/my-appretiation.component";
import { MaterailsGeneralEvaluationComponent } from "./components/evaluations/materails-general-evaluation/materails-general-evaluation.component";
import { LeaderBoardComponent } from "./components/leader-board/leader-board.component";
import { HorizontalMenuComponent } from "./horizontal-menu/horizontal-menu.component";
import { EnterCodeDialogComponent } from "./components/dialogs/enter-code-dialog/enter-code-dialog.component";
import { DeleteDialogComponent } from "./components/dialogs/delete-dialog/delete-dialog.component";
import { ConfirmDialogComponent } from "./components/dialogs/confirm-dialog/confirm-dialog.component";
import { NewDatePipe } from "./pipes/NewDate.pipe";
import { RoundPipe } from "./pipes/round.pipe";
import { SafePipe } from "./pipes/safe.pipe";
import { SecondsToTimePipe } from "./pipes/secondsToTime.pipe";
import { SliceExamPicPipe } from "./pipes/slice-exam-pic.pipe";
import { TimePipe } from "./pipes/Time.pipe";
import { TimerPipe } from "./pipes/Timer.pipe";
import { RefundLectureComponent } from "./components/refund-lecture/refund-lecture.component";
import { UserBalanceDetailsComponent } from "./components/user-balance-details/user-balance-details.component";
import { SubjectEvaluationComponent } from "./components/evaluations/subject-evaluation/subject-evaluation.component";
import { UserDataComponent } from "./components/user-data/user-data.component";

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    NgbModule,
    TranslateModule,
    FormsModule,
    OverlayModule,
    ReactiveFormsModule,
    PerfectScrollbarModule,
    ClickOutsideModule,
    AutocompleteModule,
    PipeModule,
    ChartistModule,
    NgApexchartsModule,
    MaterialModule,
    NgxSpinnerModule,
    NgxPaginationModule,
  ],
  declarations: [
    FooterComponent,
    NavbarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    CustomizerComponent,
    NotificationSidebarComponent,
    ToggleFullscreenDirective,
    SidebarLinkDirective,
    SidebarDropdownDirective,
    SidebarAnchorToggleDirective,
    SidebarDirective,
    TopMenuLinkDirective,
    TopMenuDropdownDirective,
    TopMenuAnchorToggleDirective,
    TopMenuDirective,
    RoundPipe,
    TimerPipe,
    TimePipe,
    SafePipe,
    NewDatePipe,
    SecondsToTimePipe,
    SliceExamPicPipe,
    GeneralEvaluationComponent,
    MyAppretiationComponent,
    MaterailsGeneralEvaluationComponent,
    LeaderBoardComponent,
    EnterCodeDialogComponent,
    DeleteDialogComponent,
    ConfirmDialogComponent,
    SaveExamDialogComponent,
    RefundLectureComponent,
    UserBalanceDetailsComponent,
    SubjectEvaluationComponent,
    UserDataComponent,
  ],

  exports: [
    CommonModule,
    FooterComponent,
    NavbarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    CustomizerComponent,
    NotificationSidebarComponent,
    ToggleFullscreenDirective,
    SidebarDirective,
    TopMenuDirective,
    NgbModule,
    TranslateModule,
    RoundPipe,
    TimerPipe,
    TimePipe,
    SafePipe,
    NewDatePipe,
    SecondsToTimePipe,
    SliceExamPicPipe,
    GeneralEvaluationComponent,
    MyAppretiationComponent,
    MaterailsGeneralEvaluationComponent,
    LeaderBoardComponent,
    EnterCodeDialogComponent,
    DeleteDialogComponent,
    ConfirmDialogComponent,
    SaveExamDialogComponent,
    RefundLectureComponent,
    FooterComponent,
    NavbarComponent,
    VerticalMenuComponent,
    HorizontalMenuComponent,
    CustomizerComponent,
    NotificationSidebarComponent,
    ToggleFullscreenDirective,
    SidebarLinkDirective,
    SidebarDropdownDirective,
    SidebarAnchorToggleDirective,
    SidebarDirective,
    TopMenuLinkDirective,
    TopMenuDropdownDirective,
    TopMenuAnchorToggleDirective,
    TopMenuDirective,
    RoundPipe,
    TimerPipe,
    TimePipe,
    SafePipe,
    NewDatePipe,
    SecondsToTimePipe,
    SliceExamPicPipe,
    GeneralEvaluationComponent,
    MyAppretiationComponent,
    MaterailsGeneralEvaluationComponent,
    LeaderBoardComponent,
    DeleteDialogComponent,
    ConfirmDialogComponent,
    SaveExamDialogComponent,
    RefundLectureComponent,
    UserBalanceDetailsComponent,
    SubjectEvaluationComponent,
    UserDataComponent,
  ],
})
export class SharedModule {}
