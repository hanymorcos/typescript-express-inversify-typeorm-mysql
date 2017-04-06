"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const platform_browser_1 = require("@angular/platform-browser");
const http_1 = require("@angular/http");
const forms_1 = require("@angular/forms");
const app_routing_1 = require("./app.routing");
const app_component_1 = require("./app.component");
const user_service_1 = require("./shared/services/user.service");
const users_component_1 = require("./users/users.component");
const user_list_component_1 = require("./users/user-list/user-list.component");
const user_single_component_1 = require("./users/user-single/user-single.component");
const user_edit_component_1 = require("./users/user-edit/user-edit.component");
const user_create_component_1 = require("./users/user-create/user-create.component");
const login_component_1 = require("./login/login.component");
const auth_service_1 = require("./shared/services/auth.service");
require("rxjs/add/operator/map");
require("rxjs/add/operator/toPromise");
require("rxjs/add/operator/catch");
require("rxjs/add/operator/do");
require("rxjs/add/observable/throw");
let AppModule = class AppModule {
};
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            forms_1.FormsModule,
            app_routing_1.routing
        ],
        declarations: [
            app_component_1.AppComponent,
            users_component_1.UsersComponent,
            user_list_component_1.UserListComponent,
            user_single_component_1.UserSingleComponent,
            user_edit_component_1.UserEditComponent,
            user_create_component_1.UserCreateComponent,
            login_component_1.LoginComponent
        ],
        providers: [
            user_service_1.UserService,
            auth_service_1.AuthService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map