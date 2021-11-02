import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoleType } from 'src/app/models/enums/RoleType';
import { Product } from 'src/app/models/Product';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public roleType = RoleType;

  public user: User;
  public addNewProductButtonEnabled: boolean = true;
  public products: Array<Product> = [];
  public productsSubscription: Subscription;

  constructor(private _productService: ProductService, private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this._authService.getLoggedUser();

    if (!!this.user && this.user.role == RoleType.Seller) {
      this._productService.loadSellerProducts().subscribe();
      this.productsSubscription = this._productService.productsChanged.subscribe((products: Array<Product>) => {
        this.products = products;
      });
    }
    else {
      this._productService.loadAllProducts().subscribe();
      this.productsSubscription = this._productService.productsChanged.subscribe((products: Array<Product>) => {
        this.products = products;
      })
    }
  }

  public trackByMethod(index: number, el: any) {
    return el.id;
  }

  public OnDelete(productId: number) {
    this._productService.deleteProduct(productId);
  }
}
