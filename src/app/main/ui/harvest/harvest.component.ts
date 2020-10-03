import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
import { HarvestService } from './harvest.service';
import { HarvestFormDialogComponent } from './harvest-form/harvest-form.component';
import { Harvest } from './harvest.model';

@Component({
    selector     : 'harvest',
    templateUrl  : './harvest.component.html',
    styleUrls    : ['./harvest.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class harvestComponent implements OnInit, OnDestroy
{
    dialogRef: any;
    hasSelectedHarvests: boolean;
    searchInput: FormControl;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {HarvestService} _harvestsService
     * @param {FuseSidebarService} _fuseSidebarService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _harvestsService: HarvestService,
        private _fuseSidebarService: FuseSidebarService,
        private _matDialog: MatDialog
    )
    {
        // Set the defaults
        this.searchInput = new FormControl('');

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
        this._harvestsService.onSelectedHarvestChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedHarvests => {
                this.hasSelectedHarvests = selectedHarvests.length > 0;
            });

        this.searchInput.valueChanges
            .pipe(
                takeUntil(this._unsubscribeAll),
                debounceTime(300),
                distinctUntilChanged()
            )
            .subscribe(searchText => {
                this._harvestsService.onSearchTextChanged.next(searchText);
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
     * New harvest
     */
    newHarvest(): void
    {
        this.dialogRef = this._matDialog.open(HarvestFormDialogComponent, {
            panelClass: 'harvest-form-dialog',
            data      : {
                action: 'new'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe((response: FormGroup[]) => {
                if ( !response )
                {
                    return;
                }

                let idHarvestForm: FormGroup =  response[0];      
                let siteHarvestForm: FormGroup =  response[1];      
                let conesAndSidsHarvestForm: FormGroup =  response[2];      
                let weatherHarvestForm: FormGroup =  response[3];      
                
                let harvest : Harvest = {
                    ...idHarvestForm.value,
                    ...siteHarvestForm.value,          
                    ...conesAndSidsHarvestForm.value,         
                    ...weatherHarvestForm.value,         
              };
             this._harvestsService.updateHarvest(harvest);

            });
    }

    /**
     * Toggle the sidebar
     *
     * @param name
     */
    toggleSidebar(name): void
    {
        this._fuseSidebarService.getSidebar(name).toggleOpen();
    }
}
