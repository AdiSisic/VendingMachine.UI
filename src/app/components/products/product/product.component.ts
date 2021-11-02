import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { RoleType } from 'src/app/models/enums/RoleType';
import { User } from 'src/app/models/User';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  public roleType = RoleType;

  public user: User;
  public id: number;
  public editMode = false;
  public productForm: FormGroup;

  constructor(private _route: ActivatedRoute, private _router: Router, private _productService: ProductService, private _authService: AuthenticationService) { }

  ngOnInit(): void {
    this.user = this._authService.getLoggedUser();

    this._route.params.subscribe((params: Params) => {
      this.id = +params["id"];
      this.editMode = params["id"] != null && this.id != NaN && params["id"] != 'new';
      this.initForm();
    })
  }

  public onCancel(){
    this._router.navigate(['/']);
  }

  public onSubmit(){
    if(this.editMode){
      this._productService.updateProduct(this.id, this.productForm.value).subscribe(() => {this._router.navigate(["/"])});
    }
    else{
      this._productService.addProduct(this.productForm.value).subscribe(() => {this._router.navigate(["/"])});
    }
  }

  private initForm() {
    let name:string = '';
    let amount:number = 0;
    let cost:number = 0;

    if (this.editMode) {
      let product = this._productService.getProduct(this.id);
      if(!!product)
      {
        name = product.name;
        amount = product.amount;
        cost = product.cost;
      }
    }

    this.productForm = new FormGroup({
      'name': new FormControl(name, Validators.required),
      'amount': new FormControl(amount, Validators.required),
      'cost': new FormControl(cost, Validators.required),
    });
  }

}
