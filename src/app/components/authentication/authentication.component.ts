import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginMemberRequest } from 'src/app/models/api/Request/LoginMemberRequest';
import { CreateMemberRequest } from 'src/app/models/api/Request/CreateMemberRequest';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.css']
})
export class AuthenticationComponent implements OnInit {
  public isLoginMode: boolean = true;

  constructor(private _authenticationService: AuthenticationService,
    private _router: Router,
    private _toastr: ToastrService) {
  }

  ngOnInit(): void {
    let user = this._authenticationService.getLoggedUser();
    if (!!user) {
      this._router.navigate(['/products'])
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
      this._authenticationService.login(new LoginMemberRequest(form.value.username, form.value.password)).subscribe
        (
          response => {
            if (!!response.success) {
              this._router.navigate(["/"]);
            }
            else {
              this._toastr.error(response.message);
            }
          }
        );
    }
    else {
      this._authenticationService.register(new CreateMemberRequest(form.value.username, form.value.password, form.value.role)).subscribe
        (
          response => {
            if (!!response.success) {
              this.isLoginMode = true;
              this._toastr.success("User successfully created");
            }
            else {
              this._toastr.error(response.message);
            }
          });
    }
  }
}
