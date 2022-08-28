import { NgModule } from "@angular/core";
import { RouterModule, Routes, PreloadAllModules } from "@angular/router";

import { FullLayoutComponent } from "./layouts/full-layout.component";

import { Full_ROUTES } from "./shared/routes/full-layout.routes";

const appRoutes: Routes = [
  {
    path: "",
    redirectTo: "home",
    pathMatch: "full",
  },
  {
    path: "",
    component: FullLayoutComponent,
    data: { title: "full Views" },
    children: Full_ROUTES,
    //  canActivate: [AuthGuard],
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./auth/registration.module").then((m) => m.RegistrationModule),
  },

  {
    path: "**",
    redirectTo: "auth/error",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      preloadingStrategy: PreloadAllModules,
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
