import { HomeIndexComponent } from "./pages/home-index/home-index.component";
import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { HomeRoutingModule } from "./home-routing.module";
import { CarouselModule } from "ngx-owl-carousel-o";

@NgModule({
  declarations: [HomeIndexComponent],
  imports: [CommonModule, HomeRoutingModule, CarouselModule],
})
export class HomeModule {}
