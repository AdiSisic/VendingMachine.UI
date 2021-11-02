export class Product{
    id: number;
    name: string;
    sellerId: number;
    amount: number;
    cost: number;
    originalCost: number;
    itemsToBuy: number;

    constructor(id: number, name: string, sellerId: number, amount: number, cost:number, originalCost: number){
        this.id = id;
        this.name = name;
        this.sellerId = sellerId;
        this.amount = amount;
        this.cost = cost;
        this.originalCost = originalCost
        this.itemsToBuy = 0;
    }
}