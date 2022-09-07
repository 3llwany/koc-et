import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddMaterialMainDataComponent } from "./EducationalSubject/add-materials/add-main-data/add-main-data.component";
import { ManuallyAttendanceComponent } from "./EducationalSubject/manually-attendance/manually-attendance.component";
import { MaterialPointsComponent } from "./EducationalSubject/material-points/material-points.component";
import { MaterialSearchComponent } from "./EducationalSubject/material-search/material-search.component";
import { SubjectIndexComponent } from "./EducationalSubject/subject-index/subject-index.component";
import { UploadAttendanceComponent } from "./EducationalSubject/upload-attendance/upload-attendance.component";
import { UploadExamStudentGradesComponent } from "./EducationalSubject/upload-exam-student-grades/upload-exam-student-grades.component";
import { AddStudentGroupComponent } from "./student-groups/add-student-group/add-student-group.component";
import { StudentGroupIndexComponent } from "./student-groups/student-group-index/student-group-index.component";
import { AssignStudentToGroupComponent } from "./student-groups/assign-student-to-group/assign-student-to-group.component";
const routes: Routes = [
  { path: "", redirectTo: "subjects" },
  {
    path: "subjects",
    children: [
      { path: "", redirectTo: "index" },
      {
        path: "index",
        component: SubjectIndexComponent,
      },
      {
        path: "material-search/:subjectId",
        component: MaterialSearchComponent,
      },
      {
        path: "upload-attendance/:materialId",
        component: UploadAttendanceComponent,
      },
      {
        path: "upload-exam-student-grades/:examId",
        component: UploadExamStudentGradesComponent,
      },
      {
        path: "add-material",
        component: AddMaterialMainDataComponent,
      },
      {
        path: "manually-attendance/:materialId",
        component: ManuallyAttendanceComponent,
      },
      {
        path: "material-points/:materialId",
        component: MaterialPointsComponent,
      },
    ],
  },
  { path: "student-group", component: StudentGroupIndexComponent },
  { path: "add-group", component: AddStudentGroupComponent },
  { path: "assign-student-to-group", component: AssignStudentToGroupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EducationalSetupRoutingModule {}
