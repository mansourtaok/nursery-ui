


export class User
{
    id: string;    
    name:string;
    email:string;    
    password :string;
    

    /**
     * Constructor
     *
     * @param user
     */
    constructor(user)
    {
        {
            this.id = user.id || -1;
            this.name = user.name || '';            
            this.email = user.email || -1;            
            this.password = user.password || '';            
        }
    }
}
