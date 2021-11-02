import { Component, OnInit } from '@angular/core';
import { Subscriber, Subscription } from 'rxjs';
import { RoleType } from 'src/app/models/enums/RoleType';
import { Product } from 'src/app/models/Product';
import { AuthenticationService } from 'src/app/services/auth/auth.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit {

  public addNewProductButtonEnabled: boolean = true;
  public products: Array<Product> = [];
  public productsSubscription: Subscription;

  constructor(private _productService: ProductService, private _authService: AuthenticationService) { }

  ngOnInit(): void {
    let user = this._authService.getLoggedUser();

    if (user.role == RoleType.Seller) {
     this._productService.loadSellerProducts().subscribe();
      this.productsSubscription = this._productService.productsChanged.subscribe((products: Array<Product>) => {
        this.products = products;
      });
    }
  }

  public trackByMethod(index: number, el: any) {
    return el.id;
  }

  public OnDelete(productId: number){
    this._productService.deleteProduct(productId);
  }
}
