export class User {

    id: number;
    username: string;
    deposit: number;
    role: Role;
    token:string

     constructor (id: number, username: string, deposit: number, role: Role, token: string){
        this.id = id;
        this.username = username;
        this.deposit = deposit;
        this.role = role;
        this.token = token;
     }
   }