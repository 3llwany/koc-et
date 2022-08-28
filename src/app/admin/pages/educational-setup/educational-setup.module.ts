import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { EducationalSetupRoutingModule } from "./educational-setup-routing.module";
import { SubjectIndexComponent } from "./EducationalSubject/subject-index/subject-index.component";
import { ReactiveFormsModule } from "@angular/forms";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { MaterialModule } from "app/shared/material/material.module";
import { SharedModule } from "app/shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { MaterialSearchComponent } from "./EducationalSubject/material-search/material-search.component";
import { UploadAttendanceComponent } from "./EducationalSubject/upload-attendance/upload-attendance.component";
import { AddMaterialMainDataComponent } from "./EducationalSubject/add-materials/add-main-data/add-main-data.component";
import { ManuallyAttendanceComponent } from "./EducationalSubject/manually-attendance/manually-attendance.component";
import { MaterialPointsComponent } from "./EducationalSubject/material-points/material-points.component";
import { AddMaterialPartsComponent } from "./EducationalSubject/add-materials/add-material-parts/add-material-parts.component";
import { AddMaterialFilesComponent } from "./EducationalSubject/add-materials/add-material-files/add-material-files.component";
import { AddMaterialExamComponent } from "./EducationalSubject/add-materials/add-exams/add-material-exam/add-material-exam.component";
import { AddPopQuestionComponent } from "./EducationalSubject/add-materials/add-exams/add-pop-question/add-pop-question.component";
import { UploadExamStudentGradesComponent } from './EducationalSubject/upload-exam-student-grades/upload-exam-student-grades.component';

@NgModule({
  declarations: [
    SubjectIndexComponent,
    MaterialSearchComponent,
    UploadAttendanceComponent,
    AddMaterialMainDataComponent,
    ManuallyAttendanceComponent,
    MaterialPointsComponent,
    AddMaterialPartsComponent,
    AddMaterialFilesComponent,
    AddMaterialExamComponent,
    AddPopQuestionComponent,
    UploadExamStudentGradesComponent,
  ],
  imports: [
  CommonModule,
    EducationalSetupRoutingModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    NgbModule,
    NgxSpinnerModule,
  ],
  exports: [SubjectIndexComponent],
})
export class EducationalSetupModule {}
