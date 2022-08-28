import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { SharedModule } from "./../shared/shared.module";
import { NgModule } from "@angular/core";
import { MaterialModule } from "app/shared/material/material.module";
import { DashboardRoutingModule } from "./dashboard-routing.module";
import { UsersComponent } from "./pages/users/users/users.component";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { UserBranchesRolesComponent } from "./pages/users/user-branches-roles/user-branches-roles.component";
import { FunctionsSetupComponent } from "./pages/users/functions-setup/functions-setup.component";
import { CenterBranchesComponent } from "./pages/users/center-branches/center-branches.component";
import { MatPaginatorStyleDirective } from "app/shared/directives/mat-paginator-style.directive";
import { ReservationIndexComponent } from "./pages/reservation/reservation-index/reservation-index.component";
import { ReservationEditComponent } from "./pages/reservation/reservation-edit/reservation-edit.component";
import { ReservationDetailsComponent } from "./pages/reservation/reservation-details/reservation-details.component";
import { ReservationStatusComponent } from "./pages/reservation/reservation-status/reservation-status.component";
import { StudentDiscountComponent } from "./pages/reservation/student-discount/student-discount.component";
import { StudentsIndexComponent } from "./pages/reservation/students/students-index/students-index.component";
import { AddRoleComponent } from './pages/users/roles/add-role/add-role.component';
import { RoleFunctionsComponent } from './pages/users/roles/role-functions/role-functions.component';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    NgbModule,
    NgxSpinnerModule,
  ],
  declarations: [
    UsersComponent,
    UserBranchesRolesComponent,
    FunctionsSetupComponent,
    CenterBranchesComponent,
    MatPaginatorStyleDirective,
    ReservationIndexComponent,
    ReservationEditComponent,
    ReservationDetailsComponent,
    ReservationStatusComponent,
    StudentDiscountComponent,
    StudentsIndexComponent,
    AddRoleComponent,
    RoleFunctionsComponent,
  ],
})
export class DashboardModule {}
