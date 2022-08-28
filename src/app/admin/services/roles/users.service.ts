import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class UsersService {
  deleteUserURL = environment.apiURL + "usermanagement/deleteUser";

  constructor(private http: HttpClient) {}

  getAllUsers<T>(eduCompId: any, page: number) {
    return this.http.get<T>(
      `${environment.apiURL}usermanagement/returnUsersByEduComp/${eduCompId}/${page}`
    );
  }

  addEditUser<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "usermanagement/create-user-account",
      obj
    );
  }

  deleteUser(userId: number) {
    return this.http.delete(this.deleteUserURL + "/" + userId);
  }

  getAllBranchesByCenter<T>(eduCompId: any) {
    return this.http.get<T>(
      `${environment.apiURL}usermanagement/returnCenterBranchesByEduComp/${eduCompId}`
    );
  }
}
