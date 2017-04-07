"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const router_1 = require("@angular/router");
const user_service_1 = require("./shared/services/user.service");
const auth_service_1 = require("./shared/services/auth.service");
let AppComponent = class AppComponent {
    constructor(userService, authService, router) {
        this.userService = userService;
        this.authService = authService;
        this.router = router;
    }
    ngOnInit() {
        this.userService.getUsers()
            .subscribe(users => this.users = users);
    }
    get isLoggedIn() {
        return this.authService.isLoggedIn();
    }
    logout() {
        this.authService.logout();
        this.router.navigate(['/login']);
    }
};
AppComponent = __decorate([
    core_1.Component({
        selector: 'my-app',
        template: `
    <div class="container">

      <div class="navbar navbar-default">
        <div class="container-fluid">
          <div class="navbar-header">
            <a routerLink="/" class="navbar-brand">My HTTP App</a>
          </div>

          <ul class="nav navbar-nav"> 
            <li><a routerLink="client/users">Users</a></li>
          </ul>

          <ul class="nav navbar-nav navbar-right">
            <li *ngIf="!isLoggedIn"><a routerLink="/login">Login</a></li>
            <li *ngIf="isLoggedIn"><a (click)="logout()">Logout</a></li>
          </ul>
        </div>
      </div>

      <router-outlet></router-outlet>
    </div>
  `
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        auth_service_1.AuthService,
        router_1.Router])
], AppComponent);
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map