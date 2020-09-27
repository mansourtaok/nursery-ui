import { FuseUtils } from '@fuse/utils';

export class Species
{
    id: string;
    name: string;    
    nameAr:string;   
    image:string;

    /**
     * Constructor
     *
     * @param zone
     */
    constructor(species)
    {
        {
            this.id = species.id || -1;
            this.name = species.name || '';
            this.nameAr = species.nameAr || '';
            this.image = species.image || -1;
        }
    }
}
