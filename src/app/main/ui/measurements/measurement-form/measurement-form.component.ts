import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { result } from 'lodash';
import { Sample } from '../../samples/sample.model';
import { SampleService } from '../../samples/sample.service';
import { Weather } from '../../weather/weather.model';
import { WeatherService } from '../../weather/weather.service';
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
    weatherList : Weather[];
    
    

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
        private _sampleService: SampleService,
        private _weatherService : WeatherService
        
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
        this._weatherService.getWeatherList().subscribe( result => this.weatherList = result) ;
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
            weatherId : this.measurement.weatherId,
            temperature  : [this.measurement.temperature],
            ph : [this.measurement.ph],
            ec : [this.measurement.ec],
            measurementDate : [this.measurement.measurementDate],
            weight : [this.measurement.weight],
            height : [this.measurement.height],
            diameter : [this.measurement.diameter]

        });
    }
}
