import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { HarvestFormDialogComponent } from 'app/main/ui/harvest/harvest-form/harvest-form.component';
import { HarvestService } from '../harvest.service';
import { Harvest } from '../harvest.model';

@Component({
    selector     : 'harvest-list',
    templateUrl  : './harvest-list.component.html',
    styleUrls    : ['./harvest-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class HarvestListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    harvestList: any;
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'site','description','buttons'];
    selectedHarvests: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        this.dataSource = new FilesDataSource(this._harvestService);

        this._harvestService.onHarvestChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(harvestList => {
                this.harvestList = harvestList;

                this.checkboxes = {};
                harvestList.map(harvest => {
                    this.checkboxes[harvest.id] = false;
                });
            });

        this._harvestService.onSelectedHarvestChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedHarvests => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedHarvests.includes(id);
                }
                this.selectedHarvests = selectedHarvests;
            });

        

        this._harvestService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._harvestService.deselectHarvests();
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
     * Edit harvest
     *
     * @param harvest
     */
    editHarvest(harvest): void
    {
        this.dialogRef = this._matDialog.open(HarvestFormDialogComponent, {
            panelClass: 'harvest-form-dialog',
            data      : {
                harvest: harvest,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
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

              this._harvestService.updateHarvest(harvest);                
            });
    }

    /**
     * Delete harvest
     */
    deleteHarvest(harvest): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._harvestService.deleteHarvest(harvest);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param harvestId
     */
    onSelectedChange(harvestId): void
    {
        this._harvestService.toggleSelectedHarvest(harvestId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {HarvestService} _harvestService
     */
    constructor(
        private _harvestService: HarvestService
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
        return this._harvestService.onHarvestChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
