import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class TemplatesService {
  constructor(private http: HttpClient) {}

  getTemplates(eduCompID: any, page: number, body: any) {
    return this.http.post(
      `${environment.apiURL}Admin/getTemplates/${eduCompID}/${page}`,
      body
    );
  }

  getTemplateById(templateId: any) {
    return this.http.get(
      `${environment.apiURL}template/returnTemplateById/${templateId}`
    );
  }

  deleteTemplate(id: any) {
    return this.http.get(
      `${environment.apiURL}template/deleteTemplateById/${id}`
    );
  }

  PublishDepublishTemplate(id: any) {
    return this.http.post(
      `${environment.apiURL}template/PublishDepublishTemplate/${id}`,
      null
    );
  }

  getPresets(eduCompId: any) {
    return this.http.get(
      `${environment.apiURL}template/returnPresetsByEduCompId/${eduCompId}`
    );
  }

  addUpdateTemplate(data: any) {
    return this.http.post(environment.apiURL + "template/addtemplate", data);
  }

  addTemplateDetails(data: any) {
    return this.http.post(environment.apiURL + "AJAX/addTemplateDetail", data);
  }

  getQuestionDetails(templateId: any) {
    return this.http.get(
      `${environment.apiURL}AJAX/returnTemplateDetails/${templateId}`
    );
  }

  DeleteDetails(id: any) {
    return this.http.get(
      `${environment.apiURL}template/deleteTemplateDetailById/${id}`
    );
  }

  getTemplatePoints(templateId: any, page: any) {
    return this.http.get(
      `${environment.apiURL}template/returnCustomPointTemplateByTemplateId/${templateId}/${page}`
    );
  }

  addTemplatePoint(body: any) {
    return this.http.post(
      environment.apiURL + "template/CustomTemplatePoint",
      body
    );
  }

  deleteTemplatePoint(pointId: any) {
    return this.http.delete(
      `${environment.apiURL}template/DeleteCustomTemplatePoint/${pointId}`
    );
  }
}
