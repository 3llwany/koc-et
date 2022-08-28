import {
  HttpHandler,
  HttpHeaders,
  HttpInterceptor,
  HttpRequest,
} from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { AuthService } from "./auth.service";

@Injectable({
  providedIn: "root",
})
export class TokenInterceptorService implements HttpInterceptor {
  constructor(private injector: Injector) {}

  // INTERCEPTORS are not dependable classes so we need to use
  // Injector to hold the required dependencies
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authService = this.injector.get(AuthService);

    const tokenReq = req.clone({
      setHeaders: {
        Authorization: `Basic ${authService.getToken()}`,
        "Content-Type": "application/json",
      },
    });

    return next.handle(tokenReq);
  }
}
