import { IUserVM } from "./../models/general/general";
import {
  Component,
  Output,
  EventEmitter,
  OnDestroy,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
  HostListener,
} from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { LayoutService } from "../services/layout.service";
import { Subscription } from "rxjs";
import { ConfigService } from "../services/config.service";
import { FormControl } from "@angular/forms";
import { LISTITEMS } from "../data/template-search";
import { Router } from "@angular/router";
import { AuthService } from "../services/auth/auth.service";
import { GeneralService } from "../services/General/general.service";

declare function changeStyle(): any;
@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit, AfterViewInit, OnDestroy {
  currentLang: string;
  selectedLanguageText = "English";
  selectedLanguageFlag = "./assets/img/flags/us.png";
  toggleClass = "ft-maximize";
  placement = "bottom-right";
  logoUrl = "assets/favicon.png";
  //logoUrl = 'assets/img/logo.png';
  menuPosition = "Side";
  isSmallScreen = false;
  protected innerWidth: any;
  searchOpenClass = "";
  transparentBGClass = "";
  hideSidebar: boolean = true;
  public isCollapsed = true;
  layoutSub: Subscription;
  configSub: Subscription;
  user: IUserVM;
  picturePath;
  @ViewChild("search") searchElement: ElementRef;
  @ViewChildren("searchResults") searchResults: QueryList<any>;

  @Output()
  toggleHideSidebar = new EventEmitter<Object>();

  @Output()
  seachTextEmpty = new EventEmitter<boolean>();

  listItems = [];
  control = new FormControl();

  public config: any = {};

  constructor(
    public translate: TranslateService,
    private layoutService: LayoutService,
    private router: Router,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    public authservice: AuthService,
    private GeneralServ: GeneralService
  ) {
    this.config = this.configService.templateConf;
    this.innerWidth = window.innerWidth;

    this.layoutSub = layoutService.toggleSidebar$.subscribe((isShow) => {
      this.hideSidebar = !isShow;
    });
  }

  ngOnInit() {
    //  const browserLang: string = this.translate.getBrowserLang();
    // this.translate.use(browserLang.match(/en|ar/) ? browserLang : "ar");
    this.currentLang = sessionStorage.getItem("currentLang") || "ar";
    this.translate.use(this.currentLang);
    this.listItems = LISTITEMS;
    if (this.authservice.isUser()) this.returnProfile();
    if (this.innerWidth < 1200) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  ngAfterViewInit() {
    this.ChangeLanguage(this.currentLang);
    this.configSub = this.configService.templateConf$.subscribe(
      (templateConf) => {
        if (templateConf) {
          this.config = templateConf;
        }
        this.loadLayout();
        this.cdr.markForCheck();
      }
    );
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
  }

  logout() {
    this.authservice.logout();
  }

  ChangeLanguage(language: string) {
    this.translate.use(language || "ar");
    sessionStorage.setItem("currentLang", language);
    changeStyle();

    if (language === "en") {
      this.selectedLanguageText = "English";
      this.selectedLanguageFlag = "./assets/img/flags/us.png";
    } else if (language === "ar") {
      this.selectedLanguageText = "عربي";
      this.selectedLanguageFlag = "./assets/img/flags/kw.jpeg";
    }
  }

  returnProfile() {
    this.GeneralServ.returnProfile().subscribe((res: any) => {
      this.user = res.user;
      this.picturePath = `mozakretyapi${res.picturePath}`;
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    this.innerWidth = event.target.innerWidth;
    if (this.innerWidth < 1200) {
      this.isSmallScreen = true;
    } else {
      this.isSmallScreen = false;
    }
  }

  loadLayout() {
    if (
      this.config.layout.menuPosition &&
      this.config.layout.menuPosition.toString().trim() != ""
    ) {
      this.menuPosition = this.config.layout.menuPosition;
    }

    if (this.config.layout.variant === "Light") {
      this.logoUrl = "assets/favicon.png";
      // this.logoUrl = "assets/img/logo-dark.png";
    } else {
      this.logoUrl = "assets/favicon.png";
      //this.logoUrl = "assets/img/logo.png";
    }

    if (this.config.layout.variant === "Transparent") {
      this.transparentBGClass = this.config.layout.sidebar.backgroundColor;
    } else {
      this.transparentBGClass = "";
    }
  }

  onSearchKey(event: any) {
    if (this.searchResults && this.searchResults.length > 0) {
      this.searchResults.first.host.nativeElement.classList.add(
        "first-active-item"
      );
    }

    if (event.target.value === "") {
      this.seachTextEmpty.emit(true);
    } else {
      this.seachTextEmpty.emit(false);
    }
  }

  removeActiveClass() {
    if (this.searchResults && this.searchResults.length > 0) {
      this.searchResults.first.host.nativeElement.classList.remove(
        "first-active-item"
      );
    }
  }

  onEscEvent() {
    this.control.setValue("");
    this.searchOpenClass = "";
    this.seachTextEmpty.emit(true);
  }

  onEnter() {
    if (this.searchResults && this.searchResults.length > 0) {
      let url = this.searchResults.first.url;
      if (url && url != "") {
        this.control.setValue("");
        this.searchOpenClass = "";
        this.router.navigate([url]);
        this.seachTextEmpty.emit(true);
      }
    }
  }

  redirectTo(value) {
    this.router.navigate([value]);
    this.seachTextEmpty.emit(true);
  }

  ToggleClass() {
    if (this.toggleClass === "ft-maximize") {
      this.toggleClass = "ft-minimize";
    } else {
      this.toggleClass = "ft-maximize";
    }
  }

  toggleSearchOpenClass(display) {
    this.control.setValue("");
    if (display) {
      this.searchOpenClass = "open";
      setTimeout(() => {
        this.searchElement.nativeElement.focus();
      }, 0);
    } else {
      this.searchOpenClass = "";
    }
    this.seachTextEmpty.emit(true);
  }

  toggleNotificationSidebar() {
    this.layoutService.toggleNotificationSidebar(true);
  }

  toggleSidebar() {
    this.layoutService.toggleSidebarSmallScreen(this.hideSidebar);
  }
}
