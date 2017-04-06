import { OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './shared/models/user';
import { UserService } from './shared/services/user.service';
import { AuthService } from './shared/services/auth.service';
export declare class AppComponent implements OnInit {
    private userService;
    private authService;
    private router;
    users: User[];
    constructor(userService: UserService, authService: AuthService, router: Router);
    ngOnInit(): void;
    readonly isLoggedIn: boolean;
    logout(): void;
}
