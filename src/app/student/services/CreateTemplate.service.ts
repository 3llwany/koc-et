import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class CreateTemplateService {
  constructor(private http: HttpClient) {}

  getTeachers() {
    return this.http.get(
      environment.apiURL + "AJAX/getTemplateCreationTeachers"
    );
  }

  createStudentTemplate(data: any) {
    return this.http.post(
      environment.apiURL + "AJAX/createStudentTemplate",
      data
    );
  }

  addTemplateDetail(data: any) {
    return this.http.post(environment.apiURL + "AJAX/addTemplateDetail", data);
  }

  getTemplateDetails(templateId: any) {
    return this.http.get(
      environment.apiURL + "AJAX/returnTemplateDetails/" + templateId
    );
  }

  DeleteDetails(DetailsId: any) {
    return this.http.delete(
      environment.apiURL + "template/deleteTemplateDetailById/" + DetailsId
    );
  }
}
