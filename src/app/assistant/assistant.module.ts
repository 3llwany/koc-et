import { ReactiveFormsModule } from "@angular/forms";
import { FormsModule } from "@angular/forms";
import { MaterialModule } from "./../shared/material/material.module";
import { SharedModule } from "app/shared/shared.module";
import { NgxSpinnerModule } from "ngx-spinner";
import { NgxPaginationModule } from "ngx-pagination";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { AssistantRoutingModule } from "./assistant-routing.module";
import { ChatsComponent } from "./pages/chats/chats.component";

@NgModule({
  declarations: [ChatsComponent],
  imports: [
    CommonModule,
    AssistantRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxSpinnerModule,
    SharedModule,
    MaterialModule,
  ],
})
export class AssistantModule {}
