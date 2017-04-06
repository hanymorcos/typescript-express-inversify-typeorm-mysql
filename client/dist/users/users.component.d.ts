import { OnInit } from '@angular/core';
import { UserService } from '../shared/services/user.service';
export declare class UsersComponent implements OnInit {
    private service;
    successMessage: string;
    errorMessage: string;
    constructor(service: UserService);
    ngOnInit(): void;
    clearMessages(): void;
}
