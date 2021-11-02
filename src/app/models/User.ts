import { RoleType } from "./enums/RoleType";

export class User {

    id: number;
    username: string;
    deposit: number;
    role: RoleType;
    token:string

     constructor (id: number, username: string, deposit: number, role: RoleType, token: string){
        this.id = id;
        this.username = username;
        this.deposit = deposit;
        this.role = role;
        this.token = token;
     }
   }