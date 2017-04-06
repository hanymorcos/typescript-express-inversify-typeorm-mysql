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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const inversify_express_utils_1 = require("inversify-express-utils");
const inversify_1 = require("inversify");
const user_1 = require("../service/user");
const types_1 = require("../constant/types");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    getUsers(response, next) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.getUsers();
        });
    }
    getUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.getUser(request.params.id);
        });
    }
    newUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.newUser(request.body);
        });
    }
    updateUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.updateUser(request.body.email, request.body.name);
        });
    }
    deleteUser(request) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.userService.deleteUser(request.params.id);
        });
    }
};
__decorate([
    inversify_express_utils_1.Get('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Function]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    inversify_express_utils_1.Get('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUser", null);
__decorate([
    inversify_express_utils_1.Post('/'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "newUser", null);
__decorate([
    inversify_express_utils_1.Put('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateUser", null);
__decorate([
    inversify_express_utils_1.Delete('/:id'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
UserController = __decorate([
    inversify_1.injectable(),
    inversify_express_utils_1.Controller('/api/user'),
    __param(0, inversify_1.inject(types_1.default.UserService)),
    __metadata("design:paramtypes", [user_1.UserService])
], UserController);
exports.UserController = UserController;
//# sourceMappingURL=user.js.map