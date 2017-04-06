import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
export declare class UserCreateComponent implements OnInit {
    private service;
    private router;
    user: User;
    successMessage: string;
    errorMessage: string;
    constructor(service: UserService, router: Router);
    ngOnInit(): void;
    createUser(): void;
}
