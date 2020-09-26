import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ZoneService } from '../zones.service';

@Component({
    selector   : 'zone-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class ZoneSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedZones: boolean;
    isIndeterminate: boolean;
    selectedZones: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ZoneService} _zoneService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _zoneService: ZoneService,
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
        this._zoneService.onSelectedZonesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedZones => {
                this.selectedZones = selectedZones;
                setTimeout(() => {
                    this.hasSelectedZones = selectedZones.length > 0;
                    this.isIndeterminate = (selectedZones.length !== this._zoneService.zones.length && selectedZones.length > 0);
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
        this._zoneService.selectZones();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._zoneService.deselectZones();
    }

    /**
     * Delete selected zones
     */
    deleteSelectedZones(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected zones?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._zoneService.deleteSelectedZones();
                }
                this.confirmDialogRef = null;
            });
    }
}
