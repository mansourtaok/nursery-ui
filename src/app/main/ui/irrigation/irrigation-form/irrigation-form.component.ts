import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeedingService } from '../../seeding/seeding.service';
import { StocksComponent } from '../../stocks/stocks.component';
import { StocksService } from '../../stocks/stocks.service';
import { Irrigation } from '../irrigation.model';
import { IrrigationService } from '../irrigation.service';


@Component({
    selector     : 'irrigations-irrigation-form-dialog',
    templateUrl  : './irrigation-form.component.html',
    styleUrls    : ['./irrigation-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class IrrigationFormDialogComponent
{
    action: string;
    irrigation: Irrigation;
    irrigationForm: FormGroup;
    dialogTitle: string;
    stocks :any;
    
    

    /**
     * Constructor
     *
     * @param {MatDialogRef<IrrigationFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<IrrigationFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _irrigationService: IrrigationService,
        private _stockService :StocksService
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Irrigation';
            this.irrigation = _data.irrigation;
        }
        else
        {
            this.dialogTitle = 'New Irrigation';
            this.irrigation = new Irrigation({});
        }

        
        this.irrigationForm = this.createIrrigationForm();
        this._stockService.getStocks().then(data => this.stocks = data ) ;        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create irrigation form
     *
     * @returns {FormGroup}
     */
    createIrrigationForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.irrigation.id],
            remarks    : [this.irrigation.remarks],            
            irrigationDate :[this.irrigation.irrigationDate],                  
            stockId:this.irrigation.stockId
            
        });
    }
}
