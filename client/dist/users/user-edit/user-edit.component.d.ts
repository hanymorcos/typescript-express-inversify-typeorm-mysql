import { OnInit } from '@angular/core';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
import { ActivatedRoute } from '@angular/router';
export declare class UserEditComponent implements OnInit {
    private service;
    private route;
    user: User;
    successMessage: string;
    errorMessage: string;
    constructor(service: UserService, route: ActivatedRoute);
    ngOnInit(): void;
    updateUser(): void;
}
