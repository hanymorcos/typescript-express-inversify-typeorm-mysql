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
const http_1 = require("@angular/http");
const Observable_1 = require("rxjs/Observable");
const Subject_1 = require("rxjs/Subject");
let UserService = class UserService {
    constructor(http) {
        this.http = http;
        this.usersUrl = '/api/user';
        this.userCreatedSource = new Subject_1.Subject();
        this.userDeletedSource = new Subject_1.Subject();
        this.userCreated$ = this.userCreatedSource.asObservable();
        this.userDeleted$ = this.userDeletedSource.asObservable();
    }
    getUsers() {
        return this.http.get(this.usersUrl)
            .map(res => res.json())
            .map(users => users.map(this.toUser))
            .catch(this.handleError);
    }
    getUser(id) {
        let headers = new http_1.Headers();
        let token = localStorage.getItem('auth_token');
        headers.append('Content-Type', 'application/json');
        headers.append('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.usersUrl}/${id}`, { headers })
            .map(res => res.json())
            .map(this.toUser)
            .catch(this.handleError);
    }
    createUser(user) {
        return this.http.post(this.usersUrl, user)
            .map(res => res.json())
            .do(user => this.userCreated(user))
            .catch(this.handleError);
    }
    updateUser(user) {
        return this.http.put(`${this.usersUrl}/${user.email}`, user)
            .map(res => res.json())
            .catch(this.handleError);
    }
    deleteUser(id) {
        return this.http.delete(`${this.usersUrl}/${id}`)
            .do(res => this.userDeleted())
            .catch(this.handleError);
    }
    userCreated(user) {
        this.userCreatedSource.next(user);
    }
    userDeleted() {
        this.userDeletedSource.next();
    }
    toUser(user) {
        return {
            name: user.name,
            email: user.email
        };
    }
    handleError(err) {
        let errMessage;
        if (err instanceof http_1.Response) {
            let body = err.json() || '';
            let error = body.error || JSON.stringify(body);
            errMessage = `${err.status} - ${err.statusText || ''} ${error}`;
        }
        else {
            errMessage = err.message ? err.message : err.toString();
        }
        return Observable_1.Observable.throw(errMessage);
    }
};
UserService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], UserService);
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map