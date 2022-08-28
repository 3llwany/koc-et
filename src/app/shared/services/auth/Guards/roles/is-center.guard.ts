import { AuthService } from "../../auth.service";
import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class IsCenterGuard implements CanActivate {
  constructor(private route: Router, private authservice: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authservice.isCenter()) {
      return true;
    } else {
      this.route.navigateByUrl("/home");
      return false;
    }
  }
}
