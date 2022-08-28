import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "environments/environment";

@Injectable({
  providedIn: "root",
})
export class AskTeacherService {
  constructor(private http: HttpClient) {}

  // Return askTeacher Data
  askTeacher(id: any) {
    return this.http.get(environment.apiURL + "AJAX/askTeacher/" + id);
  }

  getOpenedMsgs(page: any, TeacherSubId: any) {
    return this.http.get(
      `${environment.apiURL}AJAX/returnUserThreads/${page}/${TeacherSubId}/true`
    );
  }

  getClosedMsgs(page: any, TeacherSubId: any) {
    return this.http.get(
      `${environment.apiURL}AJAX/returnUserThreads/${page}/${TeacherSubId}/false`
    );
  }

  // Return Messages And replayes in msg
  getMsgReplaies(msgId: any) {
    return this.http.get(environment.apiURL + "AJAX/returnUserThread/" + msgId);
  }

  // Create New Messages
  createNewMsg(data: any) {
    return this.http.post(environment.apiURL + "AJAX/StartThread", data);
  }

  //Replay to Msg
  SendMessage(data: any) {
    return this.http.post(environment.apiURL + "AJAX/SendMessage", data);
  }

  getTeacherSubjectIds() {
    return this.http.get(
      environment.apiURL + "AJAX/returnTeacherSubjectIdsForAssistant"
    );
  }

  // Return Teacher Opend Msgs
  getTeacherOpenedClosedMsgs(
    p: any,
    isOpened: boolean,
    TeacherSubjectIds: any
  ) {
    return this.http.post(
      `${environment.apiURL}AJAX/returnUserThreadsForAssistant/${p}/${isOpened}`,
      TeacherSubjectIds
    );
  }

  closeMsg(msgId: number) {
    return this.http.post(
      `${environment.apiURL}AJAX/CloseThread/${msgId}`,
      null
    );
  }

  removeReply(msgId: number) {
    return this.http.delete(environment.apiURL + "AJAX/RemoveReply/" + msgId);
  }

  // Return Teacher Messages And replayes in msg
  getTeacherMsgReplaies(msgId: any) {
    return this.http.get(
      environment.apiURL + "AJAX/returnUserThreadForAssistant/" + msgId
    );
  }
}
