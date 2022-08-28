import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class RolesService {
  constructor(private http: HttpClient) {}

  getAllRoles<T>() {
    return this.http.get<T>(environment.apiURL + "usermanagement/returnRoles");
  }

  addEditRole<T, TV>(obj: T) {
    return this.http.post<TV>(
      `${environment.apiURL}usermanagement/create-role`,
      obj
    );
  }

  deleteRole(roleId: number) {
    return this.http.delete(
      environment.apiURL + "usermanagement/deleteRole" + "/" + roleId
    );
  }

  getAllFunctions<T>(page: number, getAll: boolean) {
    return this.http.get<T>(
      `${environment.apiURL}usermanagement/getAllFunctions/${page}/${getAll}`
    );
  }

  getAllRoleFunctions<T>(roleId: number) {
    return this.http.get<T>(
      `${environment.apiURL}usermanagement/returnRoleFunctionsByRoleID/${roleId}`
    );
  }

  addEditRoleFunctions<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "usermanagement/add-function-to-role",
      obj
    );
  }

  getAllFunctionsByRoleId<T>(roleId: number) {
    return this.http.get<T>(
      `${environment.apiURL}usermanagement/returnRoleFunctionsByRoleID/${roleId}`
    );
  }

  getAllUserBranchesWithFunctions<T>(userId: number) {
    return this.http.get<T>(
      `${environment.apiURL}usermanagement/returnAllBranchUserAllRoleFunction/${userId}`
    );
  }

  addUserBranchesAndRoleFunctions<T, TV>(obj: T) {
    return this.http.post<TV>(
      environment.apiURL + "usermanagement/addUserBranchesAndRoleFunctions",
      obj
    );
  }

  deleteUserRoleFunctions(functionId: number) {
    return this.http.delete(
      `${environment.apiURL}usermanagement/deleteBranchUserRoleFunction/${functionId}`
    );
  }

  deleteUserBranchRoleFunction(userId: number, branchId: number) {
    return this.http.delete(
      `${environment.apiURL}usermanagement/deleteBranchUserAllRoleFunction/${userId}/${branchId}`
    );
  }
}
