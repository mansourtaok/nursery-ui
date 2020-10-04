import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HarvestService } from '../../harvest/harvest.service';
import { SpeciesService } from '../../species/species.service';
import { Seeding } from '../seeding.model';

@Component({
    selector     : 'seeding-form-dialog',
    templateUrl  : './seeding-form.component.html',
    styleUrls    : ['./seeding-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SeedingFormDialogComponent
{
    action: string;
    seeding: Seeding;    
    dialogTitle: string;


    //Forms 
    seedingForm: FormGroup;

    harvestList : any;
    

    /**
     * Constructor
     *
     * @param {MatDialogRef<SeedingFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<SeedingFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _harvestService : HarvestService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Seeding';
            this.seeding = _data.seeding;
        }
        else
        {
            this.dialogTitle = 'New Seeding';
            this.seeding = new Seeding({});
        }

        this._harvestService.getHarvests().then(data => this.harvestList = data ) ;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    


    /**
     * On init
     */
    ngOnInit(): void
    {
        
        this.seedingForm = this._formBuilder.group({
            id   : [this.seeding.id],            
            name: [this.seeding.name,Validators.required],
            description : [this.seeding.description],
            harvestId : this.seeding.harvestId,
            transplantingDate : [this.seeding.transplantingDate],
            preSeedingDate : [this.seeding.preSeedingDate],
            directSeedingDate : [this.seeding.directSeedingDate],
            fungicideTreatment : [this.seeding.fungicideTreatment],
            remarks : [this.seeding.remarks],
            seededCellsNumber : [this.seeding.seededCellsNumber],
            seededCellsType : [this.seeding.seededCellsType],           
        });
    }
}
