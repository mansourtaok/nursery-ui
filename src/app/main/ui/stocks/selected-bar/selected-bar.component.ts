import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { StocksService } from 'app/main/ui/stocks/stocks.service';

@Component({
    selector   : 'stock-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class StocksSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedStocks: boolean;
    isIndeterminate: boolean;
    selectedStocks: string[];

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
        this._stocksService.onSelectedStocksChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedStocks => {
                this.selectedStocks = selectedStocks;
                setTimeout(() => {
                    this.hasSelectedStocks = selectedStocks.length > 0;
                    this.isIndeterminate = (selectedStocks.length !== this._stocksService.stocks.length && selectedStocks.length > 0);
                }, 0);
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
     * Select all
     */
    selectAll(): void
    {
        this._stocksService.selectStocks();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._stocksService.deselectStocks();
    }

    /**
     * Delete selected stocks
     */
    deleteSelectedStocks(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected stocks?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._stocksService.deleteSelectedStocks();
                }
                this.confirmDialogRef = null;
            });
    }
}
