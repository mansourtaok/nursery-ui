

export class Sample
{
    id: string;
    name: string;    
    description:string;
    zoneId:string;
    

    /**
     * Constructor
     *
     * @param sample
     */
    constructor(sample)
    {
        {
            this.id = sample.id || -1;
            this.name = sample.name || '';
            this.description = sample.description || '';
            this.zoneId = sample.zoneId || -1;
        }
    }
}
