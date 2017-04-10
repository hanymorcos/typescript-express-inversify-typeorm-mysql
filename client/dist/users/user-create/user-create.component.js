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
const user_service_1 = require("../../shared/services/user.service");
let UserCreateComponent = class UserCreateComponent {
    constructor(service, router) {
        this.service = service;
        this.router = router;
        this.user = { id: 0, email: '', name: '' };
        this.successMessage = '';
        this.errorMessage = '';
    }
    ngOnInit() {
    }
    createUser() {
        this.successMessage = '';
        this.errorMessage = '';
        this.service.createUser(this.user)
            .subscribe(user => {
            this.successMessage = 'User was created!';
            console.log('user was created');
            this.router.navigate(['/users']);
        });
    }
};
UserCreateComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/users/user-create/user-create.component.html'
    }),
    __metadata("design:paramtypes", [user_service_1.UserService, router_1.Router])
], UserCreateComponent);
exports.UserCreateComponent = UserCreateComponent;
//# sourceMappingURL=user-create.component.js.map