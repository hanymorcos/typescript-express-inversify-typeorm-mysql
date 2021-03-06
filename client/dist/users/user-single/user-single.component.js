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
let UserSingleComponent = class UserSingleComponent {
    constructor(route, router, service) {
        this.route = route;
        this.router = router;
        this.service = service;
        this.successMessage = '';
    }
    ngOnInit() {
        let id = this.route.snapshot.params['id'];
        this.service.getUser(id)
            .subscribe(user => this.user = user);
    }
    deleteUser() {
        this.service.deleteUser(this.user.id)
            .subscribe(data => {
            this.successMessage = 'user was deleted!';
            console.log('user was deleted');
            this.router.navigate(['/']);
        });
    }
};
UserSingleComponent = __decorate([
    core_1.Component({
        templateUrl: 'app/users/user-single/user-single.component.html'
    }),
    __metadata("design:paramtypes", [router_1.ActivatedRoute,
        router_1.Router,
        user_service_1.UserService])
], UserSingleComponent);
exports.UserSingleComponent = UserSingleComponent;
//# sourceMappingURL=user-single.component.js.map