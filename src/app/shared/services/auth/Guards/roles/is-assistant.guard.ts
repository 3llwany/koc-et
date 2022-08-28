import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { AuthService } from "../../auth.service";
@Injectable({
  providedIn: "root",
})
export class IsAssistantGuard implements CanActivate {
  constructor(private route: Router, private authservice: AuthService) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authservice.isAssistant()) {
      return true;
    } else {
      this.route.navigateByUrl("/home");
      return false;
    }
  }
}
