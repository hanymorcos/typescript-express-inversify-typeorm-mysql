"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var inversify_1 = require("inversify");
var t_user_1 = require("../entity/t_user");
var typeorm_1 = require("typeorm");
var UserService = (function () {
    function UserService() {
    }
    UserService.prototype.getUsers = function () {
        var usersPr = typeorm_1.getEntityManager().getRepository(t_user_1.User).find();
        usersPr.then(function (users) {
            var userList = [];
            for (var _i = 0, users_1 = users; _i < users_1.length; _i++) {
                var user = users_1[_i];
                userList.push({ email: user.email, name: user.name });
            }
            return userList;
        });
        return usersPr;
    };
    UserService.prototype.getUser = function (id) {
        var user = typeorm_1.getEntityManager().getRepository(t_user_1.User).findOne({ email: id });
        user.then(function (u) { return { email: u.email, name: u.name }; });
        return user;
    };
    UserService.prototype.newUser = function (user) {
        return new Promise(function (resolve, reject) {
            var uentity = new t_user_1.User();
            uentity.email = user.email;
            uentity.name = user.name;
            var e = typeorm_1.getEntityManager().getRepository(t_user_1.User).persist(uentity);
            resolve(user);
        });
    };
    UserService.prototype.updateUser = function (id, name) {
        var userRepository = typeorm_1.getEntityManager().getRepository(t_user_1.User);
        var userT = userRepository.findOne({ email: id });
        userT.then(function (u) {
            var uentity = new t_user_1.User();
            uentity.email = id;
            uentity.name = name;
            userRepository.persist(uentity);
        });
        return userT;
    };
    UserService.prototype.deleteUser = function (id) {
        var userRepository = typeorm_1.getEntityManager().getRepository(t_user_1.User);
        var userT = userRepository.findOne({ email: id });
        userT.then(function (u) {
            userRepository.remove(u);
        });
        return userT;
    };
    return UserService;
}());
UserService = __decorate([
    inversify_1.injectable()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.js.map