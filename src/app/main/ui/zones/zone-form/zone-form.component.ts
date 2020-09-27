import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StocksComponent } from '../../stocks/stocks.component';
import { StocksService } from '../../stocks/stocks.service';
import { Zone } from '../zone.model';

@Component({
    selector     : 'zones-zone-form-dialog',
    templateUrl  : './zone-form.component.html',
    styleUrls    : ['./zone-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ZoneFormDialogComponent
{
    action: string;
    zone: Zone;
    zoneForm: FormGroup;
    dialogTitle: string;
    stocks :any;
    

    /**
     * Constructor
     *
     * @param {MatDialogRef<ZoneFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<ZoneFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _stockService: StocksService,
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Zone';
            this.zone = _data.zone;
        }
        else
        {
            this.dialogTitle = 'New Zone';
            this.zone = new Zone({});
        }

        
        this.zoneForm = this.createZoneForm();
        this._stockService.getStocks().then(data => this.stocks = data ) ;
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create zone form
     *
     * @returns {FormGroup}
     */
    createZoneForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.zone.id],
            name    : [this.zone.name],
            description :[this.zone.description],
            stockId:this.zone.stockId
        });
    }
}
