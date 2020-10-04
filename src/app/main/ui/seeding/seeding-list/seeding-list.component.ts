import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SeedingService } from '../seeding.service';
import { SeedingFormDialogComponent } from '../seeding-form/seeding-form.component';

@Component({
    selector     : 'seeding-list',
    templateUrl  : './seeding-list.component.html',
    styleUrls    : ['./seeding-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SeedingListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    seedingList: any;
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name','description','buttons'];
    selectedSeedings: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        this.dataSource = new FilesDataSource(this._seedingService);

        this._seedingService.onSeedingChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(seedingList => {
                this.seedingList = seedingList;

                this.checkboxes = {};
                seedingList.map(seeding => {
                    this.checkboxes[seeding.id] = false;
                });
            });

        this._seedingService.onSelectedSeedingChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedSeedings => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedSeedings.includes(id);
                }
                this.selectedSeedings = selectedSeedings;
            });

        

        this._seedingService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._seedingService.deselectSeedings();
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
     * Edit seeding
     *
     * @param seeding
     */
    editSeeding(seeding): void
    {
        this.dialogRef = this._matDialog.open(SeedingFormDialogComponent, {
            panelClass: 'seeding-form-dialog',
            data      : {
                seeding: seeding,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':

                        this._seedingService.updateSeeding(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteSeeding(seeding);

                        break;
                }
            });
    }

    /**
     * Delete seeding
     */
    deleteSeeding(seeding): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._seedingService.deleteSeeding(seeding);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param seedingId
     */
    onSelectedChange(seedingId): void
    {
        this._seedingService.toggleSelectedSeeding(seedingId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {SeedingService} _seedingService
     */
    constructor(
        private _seedingService: SeedingService
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
        return this._seedingService.onSeedingChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
