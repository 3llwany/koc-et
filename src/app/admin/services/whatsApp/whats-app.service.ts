import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class WhatsAppService {
  constructor(private http: HttpClient) {}

  sendWhatsAppMsg(data: any) {
    return this.http.post(`${environment.apiURL}whats-app/send-message`, data);
  }
}
