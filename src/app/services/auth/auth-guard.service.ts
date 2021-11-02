import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { AuthenticationService } from "./auth.service";

@Injectable()
export class AuthGuardService implements CanActivate {

    constructor(private _autService: AuthenticationService, private _router: Router) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        let user = this._autService.getLoggedUser();
        if (!!user) {
            return true;
        }
        else {
            if (this._autService.redirectUrl == "authentication") {
                return true;
            }
            else {
                this._autService.redirectUrl = "authentication";
                this._router.navigate(['/authentication']);
                return false;
            }
        }
    }
}