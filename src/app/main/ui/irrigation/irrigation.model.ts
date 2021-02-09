


export class Irrigation
{
    id: string;    
    remarks:string;
    stockId:string;    
    irrigationDate :string;
    

    /**
     * Constructor
     *
     * @param irrigation
     */
    constructor(irrigation)
    {
        {
            this.id = irrigation.id || -1;
            this.remarks = irrigation.remarks || '';            
            this.stockId = irrigation.stockId || -1;            
            this.irrigationDate = irrigation.irrigationDate || '';            
        }
    }
}
