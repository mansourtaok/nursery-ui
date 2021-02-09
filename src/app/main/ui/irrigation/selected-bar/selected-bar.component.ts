import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { IrrigationService } from '../irrigation.service';

@Component({
    selector   : 'irrigation-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class IrrigationSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedIrrigations: boolean;
    isIndeterminate: boolean;
    selectedIrrigations: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {IrrigationService} _irrigationService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _irrigationService: IrrigationService,
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
        this._irrigationService.onSelectedIrrigationsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedIrrigations => {
                this.selectedIrrigations = selectedIrrigations;
                setTimeout(() => {
                    this.hasSelectedIrrigations = selectedIrrigations.length > 0;
                    this.isIndeterminate = (selectedIrrigations.length !== this._irrigationService.irrigations.length && selectedIrrigations.length > 0);
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
        this._irrigationService.selectIrrigations();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._irrigationService.deselectIrrigations();
    }

    /**
     * Delete selected irrigations
     */
    deleteSelectedIrrigations(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected irrigations?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._irrigationService.deleteSelectedIrrigations();
                }
                this.confirmDialogRef = null;
            });
    }
}
