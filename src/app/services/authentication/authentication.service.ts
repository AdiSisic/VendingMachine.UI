import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Router } from "@angular/router";
import { Observable, Subject, throwError } from "rxjs";
import { environment } from "src/environments/environment";
import { catchError, map, tap } from 'rxjs/operators';
import { CreateMemberRequest } from "src/app/models/api/Request/CreateMemberRequest";
import { LoginMemberRequest } from "src/app/models/api/Request/LoginMemberRequest";
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from "src/app/models/User";
import { RoleType } from "src/app/models/enums/RoleType";
import { JitEmitterVisitor } from "@angular/compiler/src/output/output_jit";


@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    private logedUser: User;
    public redirectUrl: string;
    public logedUserChanged: Subject<User> = new Subject<User>();

    constructor(private _http: HttpClient, private _router: Router, private _jwtHelper: JwtHelperService) {
    }

    /**
     * Login existing user
     * @param loginMemberRequest - Request with data needed for login of existing member
     * @returns Observable
     */
    public login(loginMemberRequest: LoginMemberRequest): Observable<any> {
        return this._http.post<any>(`${environment.baseEndpoint}/Member/loginMember`, loginMemberRequest)
            .pipe
            (
                catchError(this.handleError),
                tap(response => {
                    if (response.success) {
                        this.logedUser = new User(response.data.id, response.data.username, response.data.deposit, response.data.role as RoleType, response.data.token);
                        this.logedUserChanged.next(this.logedUser);

                        localStorage.setItem("user", JSON.stringify(this.logedUser));
                        this._router.navigate(["/"]);
                    };
                })
            );
    }

    /**
     * Register User
     * @param createMemberRequest - Request for creation of new Member
     * @returns Observable
     */
    public register(createMemberRequest: CreateMemberRequest): Observable<boolean> {
        return this._http.post<any>(`${environment.baseEndpoint}/Member/createMember`, createMemberRequest)
            .pipe
            (
                catchError(this.handleError),
                map
                    (
                        response => { return response.success }
                    )
            );

    }

    /**
     * Logout user - Remov JWT from local storage
     */
    public logout(navigate: boolean = false) {
        localStorage.removeItem("user");
        window.location.reload();
    }

    public getLoggedUser(): User {
        if (!this.logedUser) {
            let jsonUser = localStorage.getItem("user");
            if (!!jsonUser) {
                this.logedUser = JSON.parse(jsonUser);
            }
        }

        if (!!this.logedUser) {
            let jwtExpired = this._jwtHelper.isTokenExpired(this.logedUser.token);
            if(!!jwtExpired){
                this.logout();
            }
        }

        return this.logedUser;
    }

    /**
     * Check if user is authenticated
     * @returns flag indicating that user is authenticated
     */
    public isUserAuthenticated() {
        let jsonUser = localStorage.getItem("user");
        if (!!jsonUser) {
            let user: User = JSON.parse(jsonUser);

            if (!!user && !this._jwtHelper.isTokenExpired(user.token))
                return true;
        }

        return false;
    }


    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = (errorRes.error && errorRes.error.statusText) ? errorRes.error.statusText : errorRes.statusText;

        if (!errorMessage) {
            errorMessage = 'An unknown error occurred!';
        }
        return throwError(errorMessage);
    }
}