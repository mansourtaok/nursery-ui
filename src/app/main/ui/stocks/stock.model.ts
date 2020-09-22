import { FuseUtils } from '@fuse/utils';

export class Stock
{
    id: string;
    name: string;    
    description:string;

    /**
     * Constructor
     *
     * @param contact
     */
    constructor(stock)
    {
        {
            this.id = stock.id || -1;
            this.name = stock.name || '';
            this.description = stock.description || '';
        }
    }
}
