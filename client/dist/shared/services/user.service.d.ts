import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from '../models/user';
export declare class UserService {
    private http;
    private usersUrl;
    private userCreatedSource;
    private userDeletedSource;
    userCreated$: Observable<User>;
    userDeleted$: Observable<{}>;
    constructor(http: Http);
    getUsers(): Observable<User[]>;
    getUser(id: string): Observable<User>;
    createUser(user: User): Observable<User>;
    updateUser(user: User): Observable<User>;
    deleteUser(id: string): Observable<any>;
    userCreated(user: User): void;
    userDeleted(): void;
    private toUser(user);
    private handleError(err);
}
