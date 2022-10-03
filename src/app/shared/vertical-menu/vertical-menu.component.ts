import {
  Component,
  OnInit,
  ViewChild,
  OnDestroy,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef,
  HostListener,
} from "@angular/core";
import { ROUTES } from "./vertical-menu-routes.config";
import { HROUTES } from "../horizontal-menu/navigation-routes.config";

import { Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { customAnimations } from "../animations/custom-animations";
import { DeviceDetectorService } from "ngx-device-detector";
import { ConfigService } from "../services/config.service";
import { Subscription } from "rxjs";
import { LayoutService } from "../services/layout.service";
import { AuthService } from "../services/auth/auth.service";
import { NgxSpinnerService } from "ngx-spinner";
import { GeneralService } from "../services/General/general.service";
import { IEducationalCompsVM, IBranchesVM } from "../models/general/general";

@Component({
  selector: "app-sidebar",
  templateUrl: "./vertical-menu.component.html",
  animations: customAnimations,
})
export class VerticalMenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild("toggleIcon") toggleIcon: ElementRef;
  public menuItems: any[];
  level: number = 0;
  logoUrl = "assets/img/logo.png";
  public config: any = {};
  protected innerWidth: any;
  layoutSub: Subscription;
  configSub: Subscription;
  perfectScrollbarEnable = true;
  collapseSidebar = false;
  resizeTimeout;

  EducationalComps: IEducationalCompsVM[];
  Branches: IBranchesVM[];
  EduCompId: any;
  branchId: number;
  constructor(
    private router: Router,
    public translate: TranslateService,
    private layoutService: LayoutService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private deviceService: DeviceDetectorService,
    public AuthService: AuthService,
    private GeneralServ: GeneralService,
    private spinner: NgxSpinnerService
  ) {
    this.config = this.configService.templateConf;
    this.innerWidth = window.innerWidth;
    this.isTouchDevice();
    this.EduCompId = this.AuthService.getEduCompId();
    if (this.EduCompId) this.onChangeEduCompId(this.EduCompId);
    this.branchId = Number(this.AuthService.getBranchId());
    if (
      AuthService.isUser() &&
      (!AuthService.isStudent() || !AuthService.isSupport())
    ) {
      this.getEduCompByUser();
    }
    if (AuthService.isUser()) {
      // console.log("branchId:getUserFunctions:  ", this.branchId);
      this.getUserFunctions(this.branchId);
    }
  }

  ngOnInit() {
    //  this.menuItems = ROUTES;
  }

  ngAfterViewInit() {
    this.AuthService.branchId.subscribe((e) => {
      this.branchId = e.branchId;
      console.log("BranCH-", e.branchId);
      this.getUserFunctions(e.branchId);
    });

    this.configSub = this.configService.templateConf$.subscribe(
      (templateConf) => {
        if (templateConf) {
          this.config = templateConf;
        }
        this.loadLayout();
        this.cdr.markForCheck();
      }
    );

    this.layoutSub = this.layoutService.overlaySidebarToggle$.subscribe(
      (collapse) => {
        if (this.config.layout.menuPosition === "Side") {
          this.collapseSidebar = collapse;
        }
      }
    );
  }

  @HostListener("window:resize", ["$event"])
  onWindowResize(event) {
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
    }
    this.resizeTimeout = setTimeout(
      (() => {
        this.innerWidth = event.target.innerWidth;
        this.loadLayout();
      }).bind(this),
      500
    );
  }

  getUserFunctions(branchId) {
    this.spinner.show();
    this.AuthService.getUserFunctions(branchId).subscribe((res: any) => {
      // console.log("functions: ", res);
      res.Groups.map((menuItems) => {
        menuItems.class = "dropdown nav-item has-sub";
        menuItems.icon = "ft-align-left";
        menuItems.isExternalLink = false;
        menuItems.badge = "";
        menuItems.badgeClass = "";
        menuItems.submenu.map((item) => {
          item.class = "dropdown-item";
          item.icon = "ft-arrow-right submenu-icon";
          item.isExternalLink = false;
          item.badge = "";
          item.badgeClass = "";
        });
      });

      res.GrouplessFunctions.map((menuItems) => {
        menuItems.class = "dropdown nav-item";
        menuItems.icon = "ft-align-left";
        menuItems.isExternalLink = false;
        menuItems.submenu = [];
      });
      this.menuItems = [];
      this.menuItems = res.Groups.concat(res.GrouplessFunctions);
      //  console.log("menuItems: ", this.menuItems);
      this.spinner.hide();
    });
  }

  getEduCompByUser() {
    this.Branches = [];
    this.branchId = null;
    this.GeneralServ.getEduCompByUser<IEducationalCompsVM>().subscribe(
      (res: any) => {
        this.EducationalComps = res;
      }
    );
  }

  onChangeEduCompId(EduCompId: any) {
    this.AuthService.setEduCompId(EduCompId);
    if (EduCompId !== "null" && EduCompId != "undefined") {
      this.GeneralServ.getBranchesByEduComp<IBranchesVM>(EduCompId).subscribe(
        (res: any) => {
          this.Branches = res;
          this.AuthService.setBranchId(res[0]?.Id);
          this.branchId = res[0]?.Id;
        }
      );
    }
  }

  changebranchId() {
    this.AuthService.setBranchId(this.branchId);
  }

  loadLayout() {
    if (this.config.layout.menuPosition === "Top") {
      // Horizontal Menu
      if (this.innerWidth < 1200) {
        // Screen size < 1200
        //  this.menuItems = HROUTES;
      }
    } else if (this.config.layout.menuPosition === "Side") {
      // Vertical Menu{
      // this.menuItems = ROUTES;
    }

    if (this.config.layout.sidebar.backgroundColor === "white") {
      this.logoUrl = "assets/img/logo-dark.png";
    } else {
      this.logoUrl = "assets/img/logo.png";
    }

    if (this.config.layout.sidebar.collapsed) {
      this.collapseSidebar = true;
    } else {
      this.collapseSidebar = false;
    }
  }

  toggleSidebar() {
    let conf = this.config;
    conf.layout.sidebar.collapsed = !this.config.layout.sidebar.collapsed;
    this.configService.applyTemplateConfigChange({ layout: conf.layout });

    setTimeout(() => {
      this.fireRefreshEventOnWindow();
    }, 300);
  }

  fireRefreshEventOnWindow = function () {
    const evt = document.createEvent("HTMLEvents");
    evt.initEvent("resize", true, false);
    window.dispatchEvent(evt);
  };

  CloseSidebar() {
    this.layoutService.toggleSidebarSmallScreen(false);
  }

  isTouchDevice() {
    const isMobile = this.deviceService.isMobile();
    const isTablet = this.deviceService.isTablet();

    if (isMobile || isTablet) {
      this.perfectScrollbarEnable = false;
    } else {
      this.perfectScrollbarEnable = true;
    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
    if (this.configSub) {
      this.configSub.unsubscribe();
    }
  }
}
