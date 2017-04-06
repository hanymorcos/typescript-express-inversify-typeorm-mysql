import { OnInit } from '@angular/core';
import { UserService } from '../../shared/services/user.service';
import { User } from '../../shared/models/user';
export declare class UserListComponent implements OnInit {
    private service;
    users: User[];
    constructor(service: UserService);
    ngOnInit(): void;
}
