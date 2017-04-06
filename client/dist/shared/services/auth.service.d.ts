import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
export declare class AuthService {
    private http;
    private authUrl;
    private loggedIn;
    constructor(http: Http);
    isLoggedIn(): boolean;
    login(username: string, password: string): Observable<string>;
    logout(): void;
    private handleError(err);
}
