"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_1 = require("inversify");
const t_user_1 = require("../entity/t_user");
const typeorm_1 = require("typeorm");
let UserService = class UserService {
    getUsers() {
        let usersPr = typeorm_1.getEntityManager().getRepository(t_user_1.User).find();
        let returnType = usersPr.then((users) => {
            var userList = [];
            for (let user of users) {
                userList.push({ id: user.id, email: user.email, name: user.name });
            }
            return userList;
        }).catch(console.log.bind(console));
        return returnType;
    }
    getUser(id) {
        let user = typeorm_1.getEntityManager().getRepository(t_user_1.User).findOne({ id: id });
        let returnType = user.then((u) => { return { id: u.id, email: u.email, name: u.name }; });
        return returnType;
    }
    newUser(user) {
        return new Promise((resolve, reject) => {
            let uentity = new t_user_1.User();
            uentity.email = user.email;
            uentity.name = user.name;
            let e = typeorm_1.getEntityManager().getRepository(t_user_1.User).persist(uentity);
            resolve(user);
        });
    }
    updateUser(id, name, email) {
        var userRepository = typeorm_1.getEntityManager().getRepository(t_user_1.User);
        var userT = userRepository.findOne({ id: id });
        var returnType = userT.then((u) => {
            u.email = email;
            u.name = name;
            userRepository.persist(u);
            return { id: u.id, email: email, name: name };
        });
        return returnType;
    }
    deleteUser(id) {
        var userRepository = typeorm_1.getEntityManager().getRepository(t_user_1.User);
        var userT = userRepository.findOne({ id: id });
        userT.then((u) => {
            userRepository.remove(u);
        });
    }
};
UserService = __decorate([
    inversify_1.injectable()
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.js.map