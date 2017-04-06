import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
export declare class LoginComponent implements OnInit {
    private service;
    private router;
    credentials: {
        username: string;
        password: string;
    };
    successMessage: string;
    errorMessage: string;
    constructor(service: AuthService, router: Router);
    ngOnInit(): void;
    login(): void;
}
