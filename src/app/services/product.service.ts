import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map, tap } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { Product } from "../models/Product";

@Injectable({ providedIn: 'root' })
export class ProductService {

    public products: Array<Product> = [];
    public productsChanged:Subject<Array<Product>> = new Subject<Array<Product>>();

    constructor(private _http: HttpClient) {

    }

    public loadAllProducts(): Observable<string> {
        return this._http.get<any>(`${environment.baseEndpoint}/Product/getProducts`)
        .pipe
        (
            map
            (
                products => { 
                    if(!!products.success){
                        let mappedProducts: Array<Product> = [];
                        for(let i = 0; i < products.data.length; i++){
                            mappedProducts.push(new Product(products.data[i].id,products.data[i].name, products.data[i].sellerId, products.data[i].amount,
                                products.data[i].cost, products.data[i].cost))
                            }
                            
                            this.replaceProducts(mappedProducts)
                        }

                        return products.message;
                }
            )
        );
    }

    public loadSellerProducts(): Observable<string> {
        return this._http.get<any>(`${environment.baseEndpoint}/Product/getSellerProducts`)
        .pipe
        (
            map
            (
                products => { 
                    if(!!products.success){
                        let mappedProducts: Array<Product> = [];
                        for(let i = 0; i < products.data.length; i++){
                            mappedProducts.push(new Product(products.data[i].id,products.data[i].name, products.data[i].sellerId, products.data[i].amount,
                                products.data[i].cost, products.data[i].cost))
                            }
                            
                            this.replaceProducts(mappedProducts)
                        }

                        return products.message;
                }
            )
        );
    }

    public getSellerProducts(): Array<Product>{
        return this.products.slice();
    }

    public replaceProducts(products: Array<Product>) {
        this.products = products;
        this.productsChanged.next(this.products.slice());
    }

    public addProduct(product: Product): Observable<any>{
        
        return this._http.post(`${environment.baseEndpoint}/Product/createProduct`, product);
    }

    public getProduct(id: number): Product|null{
        return this.products.find(x => x.id == id) ?? null;
    }

    public updateProduct(productId:number, product: Product): Observable<any>{
        return this._http.put(`${environment.baseEndpoint}/Product/updateProduct/${productId}`, product);
    }

    public deleteProduct(productId:number): Observable<any>{
        return this._http.delete(`${environment.baseEndpoint}/Product/deleteProduct/${productId}`)
        .pipe
        (
            tap
            (
                (response: any) => {
                    if(!!response.success){
                    let index: number = this.products.findIndex((element) => element.id == productId);
                    this.products.splice(index, 1);
                    this.productsChanged.next(this.products.slice());
                    }
                }
            )
        )
    }
}