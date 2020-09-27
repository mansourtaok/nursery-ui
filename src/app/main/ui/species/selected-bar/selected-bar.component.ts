import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SpeciesService } from '../species.service';

@Component({
    selector   : 'species-selected-bar',
    templateUrl: './selected-bar.component.html',
    styleUrls  : ['./selected-bar.component.scss']
})
export class SpeciesSelectedBarComponent implements OnInit, OnDestroy
{
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;
    hasSelectedSpecies: boolean;
    isIndeterminate: boolean;
    selectedSpecies: string[];

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {SpeciesService} _speciesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _speciesService: SpeciesService,
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
        this._speciesService.onSelectedSpeciesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedSpecies => {
                this.selectedSpecies = selectedSpecies;
                setTimeout(() => {
                    this.hasSelectedSpecies = selectedSpecies.length > 0;
                    this.isIndeterminate = (selectedSpecies.length !== this._speciesService.speciesList.length && selectedSpecies.length > 0);
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
        this._speciesService.selectSpecies();
    }

    /**
     * Deselect all
     */
    deselectAll(): void
    {
        this._speciesService.deselectSpecies();
    }

    /**
     * Delete selected species
     */
    deleteSelectedSpecies(): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete all selected species?';

        this.confirmDialogRef.afterClosed()
            .subscribe(result => {
                if ( result )
                {
                    this._speciesService.deleteSelectedSpecies();
                }
                this.confirmDialogRef = null;
            });
    }
}
