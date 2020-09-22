import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { StocksService } from 'app/main/ui/stocks/stocks.service';
import { StocksFormDialogComponent } from 'app/main/ui/stocks/stock-form/stock-form.component';

@Component({
    selector     : 'stocks-stock-list',
    templateUrl  : './stock-list.component.html',
    styleUrls    : ['./stock-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class StocksListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    stocks: any;
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name','description',  'buttons'];
    selectedStocks: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {StocksService} _stocksService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _stocksService: StocksService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._stocksService);

        this._stocksService.onStocksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(stocks => {
                this.stocks = stocks;

                this.checkboxes = {};
                stocks.map(stock => {
                    this.checkboxes[stock.id] = false;
                });
            });

        this._stocksService.onSelectedStocksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedStocks => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedStocks.includes(id);
                }
                this.selectedStocks = selectedStocks;
            });

        

        this._stocksService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._stocksService.deselectStocks();
            });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit stock
     *
     * @param stock
     */
    editStock(stock): void
    {
        this.dialogRef = this._matDialog.open(StocksFormDialogComponent, {
            panelClass: 'stock-form-dialog',
            data      : {
                stock: stock,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._stocksService.updateStock(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteStock(stock);

                        break;
                }
            });
    }

    /**
     * Delete stock
     */
    deleteStock(stock): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._stocksService.deleteStock(stock);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param stockId
     */
    onSelectedChange(stockId): void
    {
        this._stocksService.toggleSelectedStock(stockId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {StocksService} _stocksService
     */
    constructor(
        private _stocksService: StocksService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._stocksService.onStocksChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
