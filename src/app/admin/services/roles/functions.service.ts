import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class FunctionsService {
  addEditFunctionURL = environment.apiURL + "usermanagement/AddEditFunction";
  deleteFunctionURL = environment.apiURL + "usermanagement/deleteFunction";

  constructor(private http: HttpClient) {}

  addEditFunction<T, TV>(obj: T) {
    return this.http.post<TV>(this.addEditFunctionURL, obj);
  }
  //   {
  //     "Id":0,
  //     "functionName":"test عربي",
  //     "function_en_name":"test Eng",
  //     "functionURL":"url test"
  // }

  deleteFunction<T>(functionId: number) {
    return this.http.delete<T>(this.deleteFunctionURL + "/" + functionId);
  }
}
