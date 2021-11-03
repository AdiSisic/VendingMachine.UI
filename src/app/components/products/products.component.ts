import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { RoleType } from 'src/app/models/enums/RoleType';
import { Product } from 'src/app/models/Product';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ProductService } from 'src/app/services/product.service';
import { UserService } from 'src/app/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public roleType = RoleType;
  public depositSubscription: Subscription;
  public productsSubscription: Subscription;

  public user: User;
  public products: Array<Product> = [];
  
  public purchaseInProgress: boolean = false;
  public disableDepositButton: boolean = false;
  public disableDepositResetButton: boolean = false;
  public addNewProductButtonEnabled: boolean = true;

  public depositCoins: number = 0;
  public currentDeposit: number = 0;

  constructor(private _productService: ProductService,
    private _authService: AuthenticationService,
    private _userService: UserService,
    private _toastr: ToastrService) { 
    
  }
  ngOnDestroy(): void {
    this.depositSubscription?.unsubscribe();
    this.productsSubscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.user = this._authService.getLoggedUser();
    
    if (!!this.user && this.user.role == RoleType.Seller) {
      this._productService.loadSellerProducts().subscribe(response =>{
        if(!!response){
          this._toastr.error(response);
        }
      });
      
      this.productsSubscription = this._productService.productsChanged.subscribe((products: Array<Product>) => {
        this.products = products;
      });
    }
    else {
      this._productService.loadAllProducts().subscribe(response =>{
        if(!!response){
          this._toastr.error(response);
        }
      });

      this.productsSubscription = this._productService.productsChanged.subscribe((products: Array<Product>) => {
        this.products = products;

        if(!!this.user && this.user.role == RoleType.Buyer){
          this._userService.getDeposit().subscribe((deposit: number) =>{
            this.currentDeposit = deposit;
          });

          this.depositSubscription = this._userService.depositChanged.subscribe((deposit: number)=>{
            this.currentDeposit = deposit;
          });

        }
      })
    }
  }

  public trackByMethod(index: number, el: any) {
    return el.id;
  }

  public onDelete(productId: number) {
    this._productService.deleteProduct(productId).subscribe(response =>{
      if(!response.success){
        this._toastr.error(response.message);
      }
    });
  }

  public onAddDeposit(){
    if(!this.depositCoins){
      this._toastr.error("Deposit coins have not been selected");
      return;
    }

    this.disableDepositButton = true;
    this._userService.deposit(this.depositCoins).subscribe(() => {
      this.depositCoins = 0;
      this.disableDepositButton = false;
    })
  }

  public onResetDeposit(){
    this.disableDepositResetButton = true;

    this._userService.resetDeposit().subscribe(response =>{
      if(!response.success){
        this._toastr.error(response.message);
      }
      this.disableDepositResetButton = false;
    })
  }

  public onPurchase(product: Product){
    let totalCost = product.count * product.cost;
    
    if(totalCost > this.currentDeposit){
      this._toastr.error("No enough deposit coins");
      return;
    }

    this.purchaseInProgress = true;
    this._userService.purchase(product.id, product.count).subscribe(response => {
      this.purchaseInProgress = false;

      if(!!response.success){

        let message = `You have bought: ${response.data.amount} products. Total price: ${response.data.spent} coins. You have ${response.data.moneyLeft} coins left.`
        if(!!response.data.change){
          message += ' Your change is following:'
        }

        for(let change of response.data.change){
          message += ` Coin ${change.coin}: Amount ${change.amount}`
        }

        this._toastr.success(message);


        // on success, load all products and deposit to make sure that we have latest version
        this._productService.loadAllProducts().subscribe(message =>{
          if(!!message){
            this._toastr.error(message);
          }
        });
        this._userService.getDeposit().subscribe((deposit: number) =>{
          this.currentDeposit = deposit;
        });
      }
      else{
        // if there is failure, it is possible that someone has "altered" UI, reload
        this._toastr.error(response.message);
        window.location.reload();
      }
    })
  }
}
