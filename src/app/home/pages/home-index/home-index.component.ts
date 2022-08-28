import { TeacherSubjectsService } from "app/student/services/teacherSubjects.service";
import { Component, OnInit } from "@angular/core";
import { AuthService } from "app/shared/services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { OwlOptions } from "ngx-owl-carousel-o";

@Component({
  selector: "app-home-index",
  templateUrl: "./home-index.component.html",
  styleUrls: [
    "./home-index.component.scss",
    "../../../../assets/mozas/css/library/bootstrap.min.css",
    //    "../../../../assets/mozas/css/library/owl.carousel.css",
    //   "../../../../assets/mozas/css/md-font.css",
    //"../../../../assets/mozas/js/select2/dist/css/select2.min.css",
    //    "../../../../assets/mozas/css/fr-styles/froala_editor.pkgd.min.css",
    //  "../../../../assets/mozas/js/bootstrap-fileinput/css/fileinput.min.css",
    "../../../../assets/mozas/css/style-ar.css",
    "../../../../assets/mozas/css/style-en.css",
    "../../../../assets/mozas/css/rtl-ver-kh.css",
    "../../../../assets/mozas/css/prof-style-kh-3-9-ar.css",
    // "../../../../assets/mozas/css/prof-style-kh-2-en.css",
    //  "../../../../assets/mozas/plugins/autocomplete/jquery-ui.css",
    // "../../../../assets/mozas/plugins/jquery-toast-plugin/dist/jquery.toast.min.css",
  ],
})
export class HomeIndexComponent implements OnInit {
  teachers?: any = [];
  constructor(
    public authservice: AuthService,
    private TeacherSubServ: TeacherSubjectsService
  ) {}

  ngOnInit(): void {
    this.TeacherSubServ.ReturnHomeTeachers().subscribe((res: any) => {
      this.teachers = res;
      //console.log(res)
    });
  }

  customOptions: OwlOptions = {
    autoplay: false,
    loop: false,
    rewind: true,
    margin: 10,
    dots: false,
    navSpeed: 300,
    navText: [
      '<i class="fas fa-arrow-right"></i>',
      '<i class="fas fa-arrow-left"></i>',
    ],
    responsive: {
      0: {
        items: 2,
      },
      400: {
        items: 2,
      },
      740: {
        items: 4,
      },
      940: {
        items: 5,
      },
    },
    nav: false,
  };
}
