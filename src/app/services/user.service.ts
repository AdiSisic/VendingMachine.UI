import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/internal/operators/map";
import { environment } from "src/environments/environment";

@Injectable({ providedIn: "root" })
export class UserService {
    
    constructor(private _http: HttpClient){};
    
    public curentDeposit: number = 0;
    public depositChanged:Subject<number> = new Subject<number>();

    public initiateDeposit(deposit: number){
        this.curentDeposit = deposit;
    }

    public getDeposit():Observable<number>{
        return this._http.get<any>(`${environment.baseEndpoint}/User/getDeposit`)
        .pipe
        (
            map
            (
                response => {
                    if(!!response.success){
                        this.curentDeposit = response.data;
                        this.depositChanged.next(this.curentDeposit);

                        return response.data;
                    }
                }
            )
        )
    }

    public deposit(coin: number):Observable<boolean>{
        return this._http.post<any>(`${environment.baseEndpoint}/User/Deposit/${coin}`,{})
        .pipe
        (
            map
            (
                response => {
                    if(!!response.success){
                        this.curentDeposit += +coin;
                        this.depositChanged.next(this.curentDeposit);
                    }
                    return response.success;
                }
            ),
            
        );
    }

    public purchase(productId: number): Observable<boolean>{
        return this._http.get<any>(`${environment.baseEndpoint}/User/purchase/${productId}`)
        .pipe
        (
            map
            (
                response =>{
                    return response.success;
                }
            )
        )
    }
}