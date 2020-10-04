import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SpeciesService } from '../../species/species.service';
import { Harvest } from '../harvest.model';

@Component({
    selector     : 'harvest-form-dialog',
    templateUrl  : './harvest-form.component.html',
    styleUrls    : ['./harvest-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class HarvestFormDialogComponent
{
    action: string;
    harvest: Harvest;    
    dialogTitle: string;


    //Forms 
    idHarvestForm: FormGroup;
    siteHarvestForm: FormGroup;
    conesAndSidsHarvestForm: FormGroup;
    weatherHarvestForm: FormGroup;

    species : any;
    

    /**
     * Constructor
     *
     * @param {MatDialogRef<HarvestFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<HarvestFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _speciesService : SpeciesService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Harvest';
            this.harvest = _data.harvest;
        }
        else
        {
            this.dialogTitle = 'New Harvest';
            this.harvest = new Harvest({});
        }

        this._speciesService.getSpecies().then(data => this.species = data ) ;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    


    /**
     * On init
     */
    ngOnInit(): void
    {
        
        this.idHarvestForm = this._formBuilder.group({
            id   : [this.harvest.id],            
            name: [this.harvest.name,Validators.required],
            description : [this.harvest.description],
            harvestDate : [this.harvest.harvestDate],
            harvestWay : [this.harvest.harvestWay]

        
        });

        this.siteHarvestForm = this._formBuilder.group({            
            longitude: [this.harvest.longitude, Validators.required],
            latitude: [this.harvest.latitude, Validators.required],
            site : [this.harvest.site, Validators.required],
            speciesId : this.harvest.speciesId,
            elevation : [this.harvest.elevation, Validators.required],
        });

        this.conesAndSidsHarvestForm = this._formBuilder.group({            
            weight: [this.harvest.weight, Validators.required],
            conesNumber: [this.harvest.conesNumber ],
            conesWidth : [this.harvest.conesWidth],
            validCones : [this.harvest.validCones],
            validSeedsWeight : [this.harvest.validSeedsWeight],
            validSeedsNumber : [this.harvest.validSeedsNumber],
            health: [this.harvest.health]
        });

        this.weatherHarvestForm = this._formBuilder.group({            
            weather: [this.harvest.weather, Validators.required],
            temperature: [this.harvest.temperature, Validators.required]            
        });

        
    }
}
