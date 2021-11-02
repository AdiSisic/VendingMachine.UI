import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginMemberRequest } from 'src/app/models/api/Request/LoginMemberRequest';
import { CreateMemberRequest } from 'src/app/models/api/Request/CreateMemberRequest';
import { AuthenticationService } from '../../services/auth/auth.service';
import { RoleType } from 'src/app/models/enums/RoleType';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {

  public isLoginMode: boolean = true;

  constructor(private _authenticationService: AuthenticationService, private _router: Router) {
  }

  ngOnInit(): void {
    let user = this._authenticationService.getLoggedUser();
    if(!!user){
      if(user.role == RoleType.Buyer){
        this._router.navigate(['/purchase']);
      }
      else{
        this._router.navigate(['/products'])
      }
    }
  }

  /**
   * Switch between Login and Register
   */
  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  /**
   * Submit Login/Register
   * @param form 
   * @returns 
   */
  public onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    if (this.isLoginMode) {
      this._authenticationService.login(new LoginMemberRequest(form.value.username, form.value.password)).subscribe();
    }
    else {
      this._authenticationService.register(new CreateMemberRequest(form.value.username, form.value.password, form.value.role)).subscribe(response => {
        if(!!response){
          this.isLoginMode = false;
        }
      });
    }
  }

}
