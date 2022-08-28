import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from "@angular/router";
import { AuthService } from "../../auth.service";

@Injectable({
  providedIn: "root",
})
export class NotUserGuard implements CanActivate {
  constructor(private route: Router, private authservice: AuthService) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (!localStorage.getItem("token")) {
      return true;
    } else {
      this.route.navigateByUrl("");
      return false;
    }
  }
}
