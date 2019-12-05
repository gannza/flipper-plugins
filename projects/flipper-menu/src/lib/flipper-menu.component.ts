import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { trigger, transition, animate } from '@angular/animations';
import { MenuEntries } from './menu-entries';
import { Branch } from './branch';
import { User } from './user';
import { Business } from './business';
import { Menu } from './menu';

@Component({
  selector: 'flipper-menu',
  templateUrl: './flipper-menu.component.html',
  styleUrls: ['./flipper-menu.component.css'],
  animations: [
    trigger('toggleBox', [

      transition('open => closed', [
        animate('1500ms')
      ]),
      transition('closed => open', [
        animate('1000ms')
      ]),
    ])
  ]
})
export class FlipperMenuComponent implements OnInit {

  @Output() menuToggled: any = new EventEmitter<boolean>();
  @Output() switchedBusiness: any = new EventEmitter<Business>();
  @Output() switchedBranch: any = new EventEmitter<Branch>();
  @Output() routerClicked: any = new EventEmitter<any>();
  @Output() logoutUser: any = new EventEmitter<User>();

  @Input() menuEntries: MenuEntries;

  isOpen: boolean = false;
  canViewBranches: boolean = false;
  defaultBranch: Branch = null;
  loggedUser: User = null;
  branches: Branch[] = [];
  businesses: Business[] = [];
  menus: Menu[] = [];
  defaultBusiness: Business = null;
  settingMenu: Menu = null;
  constructor() { }

  ngOnInit() {
    this.init();

  }
  init() {
    if (this.menuEntries) {

      this.defaultBranch = this.menuEntries.branches.find(b => b.active == true);
      this.defaultBusiness = this.menuEntries.businesses.find(b => b.active == true);
      //TODO: why do we need settingMenu && why is active =false?
      this.settingMenu = this.menuEntries.menu.find(m => m.route == 'settings');
      this.loggedUser = this.menuEntries.user ? this.menuEntries.user : null;
      this.branches = this.menuEntries.branches.length > 0 ? this.menuEntries.branches : [];
      this.businesses = this.menuEntries.businesses.length > 0 ? this.menuEntries.businesses.filter(b => b.active == false) : [];
      this.menus = this.menuEntries.menu.length > 0 ? this.menuEntries.menu.filter(m => m.route != 'settings') : [];
      this.canViewBranches = false;
    }
  }

  toggle(): boolean {

    this.isOpen = !this.isOpen;

    this.menuToggled.emit(this.isOpen);
    return this.isOpen;
  }
  toggleBranches(): boolean {
    this.canViewBranches = !this.canViewBranches;
    return this.canViewBranches;
  }

  switchBusiness(business?: Business) {
    if (!this.defaultBusiness || business == null) {
      //TODO: test this line of code.
      throw new Error("No current default business set.");
    }
    const current = this.defaultBusiness;
    current.active = false;
    business.active = true;

    this.defaultBusiness = null;

    var businesses: Business[] = this.businesses;
    //TODO: this code bellow are not propper tested.
    businesses = businesses.filter(b => b.id !== business.id);
    if (!businesses.find(b => b.id == current.id)) {
      businesses.push(current);
    }

    this.businesses = businesses;
    this.defaultBusiness = business;
    this.switchedBusiness.emit(this.defaultBusiness);
    this.canViewBranches = false;
  }

  switchBranch(branch: Branch) {

    const current = this.defaultBranch;
    current.active = false;
    branch.active = true;

    this.defaultBranch = null;

    var branches: Branch[] = this.branches;
    //TODO: this code bellow are not propper tested.
    branches = branches.filter(b => b.id !== branch.id);
    if (!branches.find(b => b.id == current.id)) {
      branches.push(current);
    }

    this.branches = branches;
    this.defaultBranch = branch;
    this.switchedBranch.emit(this.defaultBranch);
    this.canViewBranches = false;

  }
  router(menu: Menu) {
    if (this.settingMenu.active == true) {
      this.settingMenu.active = false;
    } else {
      this.menus.find(m => m.active == true).active = false;
    }

    menu.active = true;
    const menus = this.menus;
    if (!menus.find(m => m.id == this.settingMenu.id)) {
      menus.push(this.settingMenu);
    }
    this.init();

    this.routerClicked.emit({ menus: menus, router: menu.route });
  }
  hideBranchDropDown() {
    this.canViewBranches = false;
  }

  textEllipsis(str, maxLength, { side = "end", ellipsis = "..." } = {}) {
    if (str.length > maxLength) {
      switch (side) {
        case "start":
          return ellipsis + str.slice(-(maxLength - ellipsis.length));
        case "end":
        default:
          return str.slice(0, maxLength - ellipsis.length) + ellipsis;
      }
    }
    return str;
  }
  logout(){
      return this.logoutUser.emit(this.loggedUser);
  }
}
