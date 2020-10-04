import { FuseUtils } from '@fuse/utils';

export class Seeding
{
    id: string;      
    description:string;
    name:string;
    harvestId:string;
    transplantingDate:string;
    preSeedingDate:string;
    directSeedingDate:string;
    fungicideTreatment:string;
    remarks:string;
    seededCellsNumber:string;
    seededCellsType:string;
    
    /**
     * Constructor
     *
     * @param contact
     */
    constructor(seeding)
    {
        {
            this.id = seeding.id || -1;            
            this.description = seeding.description || '';
            this.name = seeding.name || '';            
            this.seededCellsType = seeding.seededCellsType || '';
            this.seededCellsNumber = seeding.seededCellsNumber || '';
            this.remarks = seeding.remarks || '';
            this.fungicideTreatment = seeding.fungicideTreatment || '';
            this.directSeedingDate = seeding.directSeedingDate || '';
            this.preSeedingDate = seeding.preSeedingDate || '';
            this.transplantingDate = seeding.transplantingDate || '';        
            this.harvestId = seeding.harvestId || '';           
        }
    }
}
