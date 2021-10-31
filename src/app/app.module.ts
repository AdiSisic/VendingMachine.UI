import { CommonModule } from '@angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { JwtModule } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { HeaderComponent } from './components/header/header.component';
import { User } from './models/User';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { AuthInterceptorService } from './services/auth/auth-interceptor.service';

export function tokenGetter() {
  let jsonUser = localStorage.getItem("user")
  if (!jsonUser) {
    return null;
  }

  let user: User = JSON.parse(jsonUser);
  return user.token;
}

@NgModule({
  declarations: [
    AppComponent,
    AuthenticationComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    JwtModule.forRoot({ config: { tokenGetter: tokenGetter, allowedDomains: environment.allowedDomains, disallowedRoutes: [] } })
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true },
    AuthGuardService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
