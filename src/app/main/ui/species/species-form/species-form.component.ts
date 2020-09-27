import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Species } from '../species.model';
import { SpeciesService } from '../species.service';


@Component({
    selector     : 'species-form-dialog',
    templateUrl  : './species-form.component.html',
    styleUrls    : ['./species-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SpeciesFormDialogComponent
{
    action: string;
    species: Species;
    speciesForm: FormGroup;
    dialogTitle: string;
    

    /**
     * Constructor
     *
     * @param {MatDialogRef<SpeciesFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<SpeciesFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _speciesService: SpeciesService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Species';
            this.species = _data.species;
        }
        else
        {
            this.dialogTitle = 'New Species';
            this.species = new Species({});
        }

        
        this.speciesForm = this.createSpeciesForm();
        this._speciesService.getSpecies().then(data => this.species = data ) ;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create species form
     *
     * @returns {FormGroup}
     */
    createSpeciesForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.species.id],
            name    : [this.species.name],
            nameAr :[this.species.nameAr]            
        });
    }
}
