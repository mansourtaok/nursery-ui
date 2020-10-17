import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { MeasurementService } from '../measurement.service';


@Component({
    selector   : 'measurement-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class MeasurementSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedMeasurements: boolean;
    isIndeterminate: boolean;
    selectedMeasurements: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {MeasurementService} _measurementService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _measurementService: MeasurementService,
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
        this._measurementService.onSelectedMeaurementsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedMeasurements => {
                this.selectedMeasurements = selectedMeasurements;
                setTimeout(() => {
                    this.hasSelectedMeasurements = selectedMeasurements.length > 0;
                    this.isIndeterminate = (selectedMeasurements.length !== this._measurementService.measurements.length && selectedMeasurements.length > 0);
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
        this._measurementService.selectMeasurements();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._measurementService.deselectMeasurements();
    }

    /**
     * Delete selected measurements
     */
    deleteSelectedMeasurements(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected measurements?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._measurementService.deleteselectedMeasurements();
                }
                this.confirmDialogRef = null;
            });
    }
}
