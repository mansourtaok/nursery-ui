import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SampleService } from '../sample.service';

@Component({
    selector   : 'sample-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class SampleSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedSamples: boolean;
    isIndeterminate: boolean;
    selectedSamples: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {SampleService} _sampleService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _sampleService: SampleService,
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
        this._sampleService.onSelectedSamplesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedSamples => {
                this.selectedSamples = selectedSamples;
                setTimeout(() => {
                    this.hasSelectedSamples = selectedSamples.length > 0;
                    this.isIndeterminate = (selectedSamples.length !== this._sampleService.samples.length && selectedSamples.length > 0);
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
        this._sampleService.selectSamples() ;
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._sampleService.deselectSamples();
    }

    /**
     * Delete selected samples
     */
    deleteSelectedSamples(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected samples?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._sampleService.deleteselectedSamples();
                }
                this.confirmDialogRef = null;
            });
    }
}
