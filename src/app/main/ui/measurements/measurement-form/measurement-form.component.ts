import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Sample } from '../../samples/sample.model';
import { SampleService } from '../../samples/sample.service';
import { ZoneService } from '../../zones/zones.service';
import { Measurement } from '../measurement.model';



@Component({
    selector     : 'measurement-form-dialog',
    templateUrl  : './measurement-form.component.html',
    styleUrls    : ['./measurement-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class MeasurementFormDialogComponent
{
    action: string;
    measurement: Measurement;
    measurementForm: FormGroup;
    dialogTitle: string;
    measurements :any;

    samples : Sample[];
    
    

    /**
     * Constructor
     *
     * @param {MatDialogRef<MeasurementFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<MeasurementFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _sampleService: SampleService
        
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Measurement';
            this.measurement = _data.measurement;
        }
        else
        {
            this.dialogTitle = 'New Measurement';
            this.measurement = new Measurement({});
        }

        
        this.measurementForm = this.createMeasurementForm();
        this._sampleService.getSamples().then(data => this.samples = data) ;        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create measurement form
     *
     * @returns {FormGroup}
     */
    createMeasurementForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.measurement.id],
            name    : [this.measurement.name],
            remarks :[this.measurement.remarks],
            sampleId : this.measurement.sampleId,
            ph : [this.measurement.ph],
            ec : [this.measurement.ec],
            measurementDate : [this.measurement.measurementDate],
            weight : [this.measurement.weight],
            height : [this.measurement.height],
            diameter : [this.measurement.diameter]

        });
    }
}
