import { FuseUtils } from '@fuse/utils';

export class Zone
{
    id: string;
    name: string;    
    description:string;
    stockId:string;

    /**
     * Constructor
     *
     * @param zone
     */
    constructor(zone)
    {
        {
            this.id = zone.id || -1;
            this.name = zone.name || '';
            this.description = zone.description || '';
            this.stockId = zone.stockId || -1;
        }
    }
}