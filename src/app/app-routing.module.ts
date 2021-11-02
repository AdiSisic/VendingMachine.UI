import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './components/authentication/authentication.component';
import { DepositComponent } from './components/deposit/deposit.component';
import { ProductComponent } from './components/products/product/product.component';
import { ProductsComponent } from './components/products/products.component';
import { PurchaseComponent } from './components/purchase/purchase.component';
import { AuthGuardService } from './services/auth/auth-guard.service';

const routes: Routes = [
  { path: '', component: AuthenticationComponent, canActivate: [AuthGuardService] },
  { path: 'authentication', component: AuthenticationComponent, canActivate: [AuthGuardService] },
  { path: 'purchase', component: PurchaseComponent },
  { path: 'deposit', component: DepositComponent, canActivate: [AuthGuardService] },
  { path: 'products', component: ProductsComponent, canActivate: [AuthGuardService] },
  { path: 'product/:id', component: ProductComponent, canActivate: [AuthGuardService] },
  { path: 'product/new', component: ProductComponent, canActivate: [AuthGuardService] },
  { path: '**', component: AuthenticationComponent, canActivate: [AuthGuardService] },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
