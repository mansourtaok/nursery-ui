import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SeedingService } from '../seeding.service';

@Component({
    selector   : 'seeding-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class SeedingSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedSeedings: boolean;
    isIndeterminate: boolean;
    selectedSeedings: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {SeedingService} _seedingService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _seedingService: SeedingService,
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
        this._seedingService.onSelectedSeedingChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedSeedings => {
                this.selectedSeedings = selectedSeedings;
                setTimeout(() => {
                    this.hasSelectedSeedings = selectedSeedings.length > 0;
                    this.isIndeterminate = (selectedSeedings.length !== this._seedingService.seedingList.length && selectedSeedings.length > 0);
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
        this._seedingService.selectSeedings();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._seedingService.deselectSeedings();
    }

    /**
     * Delete selected seedings
     */
    deleteSelectedSeedings(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected seeding?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._seedingService.deleteSelectedSeeding();
                }
                this.confirmDialogRef = null;
            });
    }
}
