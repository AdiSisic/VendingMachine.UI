import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { ProductComponent } from './components/products/product/product.component';
import { ProductsComponent } from './components/products/products.component';
import { AuthenticationGuardService } from './services/authentication/authentication-guard.service';

const routes: Routes = [
  { path: '', component: AuthenticationComponent, canActivate: [AuthenticationGuardService] },
  { path: 'authentication', component: AuthenticationComponent, canActivate: [AuthenticationGuardService] },
  // { path: 'purchase', component: PurchaseComponent },
  // { path: 'deposit', component: DepositComponent, canActivate: [AuthenticationGuardService] },
  { path: 'products', component: ProductsComponent },
  { path: 'product/:id', component: ProductComponent, canActivate: [AuthenticationGuardService] },
  { path: 'product/new', component: ProductComponent, canActivate: [AuthenticationGuardService] },
  { path: '**', component: AuthenticationComponent, canActivate: [AuthenticationGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
