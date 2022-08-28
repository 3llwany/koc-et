import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class GenerateCodesService {
  constructor(private http: HttpClient) {}

  GenerateCodes(EduCompId: number, data: any) {
    return this.http.post(
      environment.apiURL + "codes/GenerateCodes/" + EduCompId,
      data
    );
  }

  searchCodes<T>(code: string, counter: string) {
    return this.http.get<T>(
      environment.apiURL + "codes/MaterialCodes/" + code + "/" + counter
    );
  }

  GenerateBalanceCodes<T>(data: T) {
    return this.http.post<T>(
      environment.apiURL + "codes/GenerateCustomBalanceCodes",
      data
    );
  }

  applyBalanceCode(code: string) {
    return this.http.post(
      environment.apiURL + "codes/applyCustomBalanceCode/" + code,
      null
    );
  }
}
