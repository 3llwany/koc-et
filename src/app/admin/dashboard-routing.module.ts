import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { UserBalanceDetailsComponent } from "app/shared/components/user-balance-details/user-balance-details.component";
import { IsAdminGuard } from "app/shared/services/auth/Guards/roles/is-admin.guard";
import { ReservationEditComponent } from "./pages/reservation/reservation-edit/reservation-edit.component";
import { ReservationIndexComponent } from "./pages/reservation/reservation-index/reservation-index.component";
import { ReservationStatusComponent } from "./pages/reservation/reservation-status/reservation-status.component";
import { StudentDiscountComponent } from "./pages/reservation/student-discount/student-discount.component";
import { StudentsIndexComponent } from "./pages/reservation/students/students-index/students-index.component";
import { CenterBranchesComponent } from "./pages/users/center-branches/center-branches.component";
import { FunctionsSetupComponent } from "./pages/users/functions-setup/functions-setup.component";
import { AddRoleComponent } from "./pages/users/roles/add-role/add-role.component";
import { RoleFunctionsComponent } from "./pages/users/roles/role-functions/role-functions.component";
import { UserBranchesRolesComponent } from "./pages/users/user-branches-roles/user-branches-roles.component";
import { UsersComponent } from "./pages/users/users/users.component";

const routes: Routes = [
  {
    path: "users",
    component: UsersComponent,
  },

  {
    path: "user-roles-branches/:userId/:roleId",
    component: UserBranchesRolesComponent,
  },

  {
    path: "functions",
    component: FunctionsSetupComponent,
  },

  {
    path: "center-branches",
    component: CenterBranchesComponent,
  },

  {
    path: "students-index",
    component: StudentsIndexComponent,
  },
  {
    path: "roles",
    component: AddRoleComponent,
  },
  {
    path: "role-fuctions/:roleId",
    component: RoleFunctionsComponent,
  },

  {
    path: "reservation",
    children: [
      { path: "", redirectTo: "index", pathMatch: "full" },
      { path: "index", component: ReservationIndexComponent },
      {
        path: "edit-reservation/:reservationId",
        component: ReservationEditComponent,
      },
      {
        path: "reservation-status/:reservationId",
        component: ReservationStatusComponent,
      },
      {
        path: "student-discount/:userId",
        component: StudentDiscountComponent,
      },
      {
        path: "balance-details/:userId",
        component: UserBalanceDetailsComponent,
      },
    ],
  },

  {
    path: "educational-setup",
    loadChildren: () =>
      import("./pages/educational-setup/educational-setup.module").then(
        (m) => m.EducationalSetupModule
      ),
  },

  {
    path: "setup",
    loadChildren: () =>
      import("./pages/setup/setup.module").then((m) => m.SetupModule),
  },

  {
    path: "exams",
    loadChildren: () =>
      import("./pages/exams-setup/exams.module").then((m) => m.ExamsModule),
  },

  {
    path: "reports",
    loadChildren: () =>
      import("./pages/reports/reports.module").then((m) => m.ReportsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
