import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from "@angular/common/http";
import { Router } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Observable, throwError } from "rxjs";
import { catchError, retry } from "rxjs/operators";
import { AuthService } from "./auth.service";
import { NgxSpinnerService } from "ngx-spinner";

@Injectable({
  providedIn: "root",
})
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      retry(1),

      catchError((err: HttpErrorResponse) => {
        let error;

        if ([401, 403].indexOf(err.status) !== -1) {
          // auto logout if 401 Unauthorized or 403 Forbidden
          this.toastr.error("Login Session has expired!");
          this.authService.logout();
          return throwError("Session has expired!");
        } else if (err.status === 404) {
          // this.router.navigate(["/notFound", err.status], {
          //   queryParams: {
          //     "Error-Status": err.status
          //   }
          // });
          error = err.message || err.statusText;
          this.toastr.error(err.message, "Error");
          this.spinner.hide();
          console.log(error);
          return throwError(error);
        }

        if (err.status === 500 || err.status === 400) {
          // this.router.navigate(["", err.status], {
          //   queryParams: {
          //     "Error-Status": err.status
          //   }
          // });
          error = err.message || err.statusText;
          this.toastr.error(err.message, "Error");
          this.spinner.hide();
          console.log(error);
          return throwError(error);
        } else {
          error = err.message || err.statusText;
          this.toastr.error(err.message, "Error");
          this.spinner.hide();
          console.log(error);
          return throwError(error);
        }
      })
    );
  }
}
