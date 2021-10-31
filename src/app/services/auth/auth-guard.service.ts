import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { AuthenticationService } from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private _router: Router, private _jwtHelper: JwtHelperService, private _authenticationService: AuthenticationService) {
    }

    canActivate() {
        let user = this._authenticationService.getLoggedUser();
        if(!!user)
        {
            this._router.navigate(["/"]);
            return false;
        }
        
        return true;
        // this._router.navigate(["/authentication"])
        // return true;
    }
}