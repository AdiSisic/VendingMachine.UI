export class CreateMemberRequest {

   Username: string
   Password: string
   Role: string
    
    constructor (username: string, password: string, role: string){
       this.Username = username;
       this.Password = password;
       this.Role = role;
    }}