import { IsSupportGuard } from "./../services/auth/Guards/roles/is-support.guard";
import { Routes } from "@angular/router";
import { IsStudentGuard } from "../services/auth/Guards/roles/is-student.guard";
import { UserDataComponent } from "../components/user-data/user-data.component";
import { IsUserGuard } from "../services/auth/Guards/auth/is-user.guard";

//Route for content layout with sidebar, navbar and footer.

export const Full_ROUTES: Routes = [
  {
    path: "home",
    loadChildren: () =>
      import("../../home/home.module").then((m) => m.HomeModule),
  },

  {
    path: "profile",
    component: UserDataComponent,
    canActivate: [IsUserGuard],
  },

  // Admin
  {
    path: "dashboard",
    loadChildren: () =>
      import("../../admin/dashboard.module").then((m) => m.DashboardModule),
  },

  // Assistant
  {
    path: "dashboard",
    loadChildren: () =>
      import("../../assistant/assistant.module").then((m) => m.AssistantModule),
  },

  // Student
  {
    path: "student",
    loadChildren: () =>
      import("../../student/student.module").then((m) => m.StudentModule),
    canActivate: [IsStudentGuard],
  },

  // Student
  {
    path: "support",
    loadChildren: () =>
      import("../../support/support.module").then((m) => m.SupportModule),
    canActivate: [IsSupportGuard],
  },
];
