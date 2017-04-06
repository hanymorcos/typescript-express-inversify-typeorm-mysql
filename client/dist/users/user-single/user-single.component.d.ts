import { OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../shared/models/user';
import { UserService } from '../../shared/services/user.service';
export declare class UserSingleComponent implements OnInit {
    private route;
    private router;
    private service;
    user: User;
    constructor(route: ActivatedRoute, router: Router, service: UserService);
    ngOnInit(): void;
    deleteUser(): void;
}
