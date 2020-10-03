import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { HarvestService } from '../harvest.service';

@Component({
    selector   : 'harvest-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class HarvestSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedHarvests: boolean;
    isIndeterminate: boolean;
    selectedHarvests: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {HarvestService} _harvestService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _harvestService: HarvestService,
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
        this._harvestService.onSelectedHarvestChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedHarvests => {
                this.selectedHarvests = selectedHarvests;
                setTimeout(() => {
                    this.hasSelectedHarvests = selectedHarvests.length > 0;
                    this.isIndeterminate = (selectedHarvests.length !== this._harvestService.harvestList.length && selectedHarvests.length > 0);
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
        this._harvestService.selectHarvests();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._harvestService.deselectHarvests();
    }

    /**
     * Delete selected harvests
     */
    deleteSelectedHarvests(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected harvest?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._harvestService.deleteSelectedHarvest();
                }
                this.confirmDialogRef = null;
            });
    }
}
