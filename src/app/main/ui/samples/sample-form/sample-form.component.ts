import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ZoneService } from '../../zones/zones.service';
import { Sample } from '../sample.model';


@Component({
    selector     : 'sample-form-dialog',
    templateUrl  : './sample-form.component.html',
    styleUrls    : ['./sample-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class SampleFormDialogComponent
{
    action: string;
    sample: Sample;
    sampleForm: FormGroup;
    dialogTitle: string;
    samples :any;
    zonesList : any;
    

    /**
     * Constructor
     *
     * @param {MatDialogRef<SampleFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<SampleFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _zoneService: ZoneService
        
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Sample';
            this.sample = _data.sample;
        }
        else
        {
            this.dialogTitle = 'New Sample';
            this.sample = new Sample({});
        }

        
        this.sampleForm = this.createSampleForm();
        this._zoneService.getZones().then(data => this.zonesList = data ) ;
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create sample form
     *
     * @returns {FormGroup}
     */
    createSampleForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.sample.id],
            name    : [this.sample.name],
            description :[this.sample.description],
            zoneId : this.sample.zoneId
        });
    }
}
