import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoleType } from 'src/app/models/enums/RoleType';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  
  public roleType = RoleType;

  public user: User;
  private userSubscription: Subscription;

  constructor(private _authenticationService: AuthenticationService) {
    this.user = this._authenticationService.getLoggedUser(); 
  }

  ngOnInit(): void {
    this.userSubscription = this._authenticationService.logedUserChanged.subscribe((user: User) => this.user = user);
  }

  ngOnDestroy():void{
    this.userSubscription?.unsubscribe();
  }

  public logout(){
    this._authenticationService.logout(true);
  }
}