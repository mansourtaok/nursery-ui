import { FuseUtils } from '@fuse/utils';

export class Measurement
{
    id: string;
    name: string;    
    remarks:string;
    sampleId:string;
    ph:string;
    ec:string;
    measurementDate:string;
    weight:string;
    height:string;
    diameter:string;
    

    /**
     * Constructor
     *
     * @param measurement
     */
    constructor(measurement)
    {
        {
            this.id = measurement.id || -1;
            this.name = measurement.name || '';
            this.remarks = measurement.remarks || '';
            this.sampleId = measurement.sampleId || '';
            this.ph = measurement.ph || '';
            this.ec = measurement.ec || '';
            this.measurementDate = measurement.measurementDate || '';
            this.weight = measurement.weight || '';
            this.height = measurement.height || '';
            this.diameter = measurement.diameter || '';
        }
    }
}
