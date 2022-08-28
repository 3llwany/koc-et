import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class BranchesService {
  getAllBranchesURL =
    environment.apiURL + "usermanagement/returnCenterBranchesByEduComp/";
  addEditBranchesURL = environment.apiURL + "usermanagement/AddEditBranch";
  deleteBranchesURL = environment.apiURL + "usermanagement/deleteBranch";

  getAllDistrictsURL =
    environment.apiURL + "usermanagement/returnDistrictsList"; // DropDownMenu
  getAllAllCenterBranchesURL =
    environment.apiURL + "usermanagement/returnAllCenterBranches"; // /{page} => paginated

  constructor(private http: HttpClient) {}

  getAllBranches<T>(eduCompId: any) {
    return this.http.get<T>(this.getAllBranchesURL + "/" + eduCompId);
  }

  getAllAllCenterBranches<T>(page: number) {
    return this.http.get<T>(this.getAllAllCenterBranchesURL + "/" + page);
  }

  addEditBranches<T, TV>(obj: T) {
    return this.http.post<TV>(this.addEditBranchesURL, obj);
  }
  //   {
  //     "Id":18,
  //     "EduCompId":2,
  //     "Name":"Test edit Branch",
  //     "districtId":2
  // }

  deleteBranch<T>(branchId: number) {
    return this.http.delete<T>(this.deleteBranchesURL + "/" + branchId);
  }

  getAllDistricts<T>() {
    return this.http.get<T>(this.getAllDistrictsURL);
  }
}
