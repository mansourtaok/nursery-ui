import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Stock } from 'app/main/ui/stocks/stock.model';

@Component({
    selector     : 'stocks-stock-form-dialog',
    templateUrl  : './stock-form.component.html',
    styleUrls    : ['./stock-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class StocksFormDialogComponent
{
    action: string;
    stock: Stock;
    stockForm: FormGroup;
    dialogTitle: string;

    /**
     * Constructor
     *
     * @param {MatDialogRef<StocksFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<StocksFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit Stock';
            this.stock = _data.stock;
        }
        else
        {
            this.dialogTitle = 'New Stock';
            this.stock = new Stock({});
        }

        this.stockForm = this.createStockForm();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create stock form
     *
     * @returns {FormGroup}
     */
    createStockForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.stock.id],
            name    : [this.stock.name],
            description :[this.stock.description],
        });
    }
}
