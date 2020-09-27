import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { SpeciesService } from '../species.service';
import { SpeciesFormDialogComponent } from '../species-form/species-form.component';

@Component({
    selector     : 'species-list',
    templateUrl  : './species-list.component.html',
    styleUrls    : ['./species-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SpeciesListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    speciesList: any;
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name','nameAr',  'buttons'];
    selectedSpecies: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        this.dataSource = new FilesDataSource(this._speciesService);

        this._speciesService.onSpeciesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(species => {
                this.speciesList = species;

                this.checkboxes = {};
                species.map(sp => {
                    this.checkboxes[sp.id] = false;
                });
            });

        this._speciesService.onSelectedSpeciesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(sps => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = sps.includes(id);
                }
                this.selectedSpecies = sps;
            });

        

        this._speciesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._speciesService.deselectSpecies();
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
     * Edit species
     *
     * @param species
     */
    editSpecies(species): void
    {
        this.dialogRef = this._matDialog.open(SpeciesFormDialogComponent, {
            panelClass: 'species-form-dialog',
            data      : {
                species: species,
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
                        this._speciesService.updateSpecies(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteSpecies(species);

                        break;
                }
            });
    }

    /**
     * Delete species
     */
    deleteSpecies(species): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._speciesService.deleteSpecies(species);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param speciesId
     */
    onSelectedChange(speciesId): void
    {
        this._speciesService.toggleSelectedSpecies(speciesId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {SpeciesService} _speciesService
     */
    constructor(
        private _speciesService: SpeciesService
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
        return this._speciesService.onSpeciesChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
