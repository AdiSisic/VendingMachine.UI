import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { AuthGuardService } from './services/auth/auth-guard.service';

const routes: Routes = [
  //{path: 'customers', component: CustomersComponetn, canActivate: [AuthGuardService]}
  { path: 'authentication', component: AuthenticationComponent, canActivate: [AuthGuardService]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
