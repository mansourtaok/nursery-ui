


export class Auth
{
    email: string;    
    password:string;
    

    constructor(auth)
    {
        {
            this.email = auth.username || '';
            this.password = auth.password || '';            
        }
    }
}
