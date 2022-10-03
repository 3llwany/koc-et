import { NgxSpinnerService } from "ngx-spinner";
import { TranslateService } from "@ngx-translate/core";
import { AuthService } from "app/shared/services/auth/auth.service";
import {
  Component,
  OnInit,
  ChangeDetectorRef,
  AfterViewInit,
  OnDestroy,
} from "@angular/core";
import { HROUTES } from "./navigation-routes.config";
import { ConfigService } from "../services/config.service";
import { Subscription } from "rxjs";
import { IUserBalanceVM } from "app/student/models/balance";
import { StudentService } from "app/student/services/student.service";
import { GeneralService } from "../services/General/general.service";
import {
  IBranchesVM,
  IEducationalCompsVM,
  statutsDropVM,
} from "../models/general/general";
import { Router } from "@angular/router";

@Component({
  selector: "app-horizontal-menu",
  templateUrl: "./horizontal-menu.component.html",
  styleUrls: ["./horizontal-menu.component.scss"],
})
export class HorizontalMenuComponent
  implements OnInit, AfterViewInit, OnDestroy
{
  public menuItems: any[];
  public config: any = {};
  level: number = 0;
  transparentBGClass = "";
  menuPosition = "Top";

  layoutSub: Subscription;

  BalanceData: IUserBalanceVM;
  EducationalComps: IEducationalCompsVM[];
  Branches: IBranchesVM[];
  EduCompId: any;
  branchId: any;
  constructor(
    public router: Router,
    public AuthService: AuthService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef,
    private studentserv: StudentService,
    private translate: TranslateService,
    private GeneralServ: GeneralService,
    private spinner: NgxSpinnerService
  ) {
    this.config = this.configService.templateConf;
    this.EduCompId = this.AuthService.getEduCompId();
    if (this.EduCompId) this.onChangeEduCompId(this.EduCompId);
    this.branchId = this.AuthService.getBranchId();
    //  console.log("EduCompId: ", this.EduCompId);
    //  console.log("branchId: ", this.branchId);
    if (
      AuthService.isUser() &&
      (!AuthService.isStudent() || !AuthService.isSupport())
    ) {
      this.getEduCompByUser();
    }
    if (AuthService.isUser()) {
      this.getUserFunctions(this.branchId);
    }
    if (!AuthService.isUser()) {
      this.menuItems = [];
    }
  }

  ngOnInit() {
    if (this.AuthService.isStudent()) {
      this.balanceCheck();
    }
    // this.menuItems = routs;
  }

  ngAfterViewInit() {
    this.AuthService.branchId.subscribe((e) => {
      this.branchId = e.branchId;
      this.getUserFunctions(e.branchId);
    });

    this.layoutSub = this.configService.templateConf$.subscribe(
      (templateConf) => {
        if (templateConf) {
          this.config = templateConf;
        }
        this.loadLayout();
        this.cdr.markForCheck();
      }
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
    this.branchId = "";
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

  // Return  balanceCheck Data
  balanceCheck() {
    this.studentserv.balanceCheck<IUserBalanceVM>().subscribe((res) => {
      this.BalanceData = res;
    });
  }

  loadLayout() {
    if (
      this.config.layout.menuPosition &&
      this.config.layout.menuPosition.toString().trim() != ""
    ) {
      this.menuPosition = this.config.layout.menuPosition;
    }

    if (this.config.layout.variant === "Transparent") {
      this.transparentBGClass = this.config.layout.sidebar.backgroundColor;
    } else {
      this.transparentBGClass = "";
    }
  }

  ngOnDestroy() {
    if (this.layoutSub) {
      this.layoutSub.unsubscribe();
    }
  }
}
