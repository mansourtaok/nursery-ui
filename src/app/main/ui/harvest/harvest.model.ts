import { FuseUtils } from '@fuse/utils';

export class Harvest
{
    id: string;
    image: string;    
    description:string;
    name:string;
    harvestDate:string;
    harvestWay:string;
    

    site:string;
    longitude:string;
    latitude:string;
    elevation:string;
    speciesId:string;
    
    
    weigth:string;
    conesNumber:string;
    conesWidth:string;    
    validCones:string;
    validSeedsWeight:string;
    validSeedsNumber:string;
    health:string;
    
    weather:string;    
    temperature:string;
    



    /**
     * Constructor
     *
     * @param contact
     */
    constructor(harvest)
    {
        {
            this.id = harvest.id || -1;
            this.image = harvest.image || '';
            this.description = harvest.description || '';
            this.name = harvest.name || '';
            this.site = harvest.site || '';
            this.latitude = harvest.latitude || '';
            this.longitude = harvest.longitude || '';
            this.harvestDate = harvest.harvestDate || '';
            this.harvestWay = harvest.harvestWay || '';
            this.weigth = harvest.weigth || '';
            this.conesNumber = harvest.conesNumber || '';
            this.conesWidth = harvest.conesWidth || '';
            this.validCones = harvest.validCones || '';
            this.validSeedsWeight = harvest.validSeedsWeight || '';
            this.validSeedsNumber = harvest.validSeedsNumber || '';
            this.weather = harvest.weather || '';
            this.health = harvest.health || '';
            this.temperature = harvest.temperature || '';
            this.speciesId = harvest.speciesId || '';        
            this.elevation = harvest.elevation || '';        
        }
    }
}
