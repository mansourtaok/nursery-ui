import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';

import { StocksService } from '../../stocks/stocks.service';
import { Stock } from '../../stocks/stock.model';
import { Seeding } from '../../seeding/seeding.model';
import { SeedingService } from '../../seeding/seeding.service';
import { SampleService } from '../sample.service';
import { ZoneService } from '../../zones/zones.service';
import { Zone } from '../../zones/zone.model';
import { SampleFormDialogComponent } from '../sample-form/sample-form.component';

@Component({
    selector     : 'sample-list',
    templateUrl  : './sample-list.component.html',
    styleUrls    : ['./sample-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class SampleListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    samples: any;
    zones : Zone[];
    
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name', 'zone','description',  'buttons'];
    selectedSamples: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {ZoneService} _samplesService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _samplesService: SampleService,        
        private _zoneService : ZoneService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    zoneName(zoneId):string {
        return this.zones.find(s => s.id == zoneId).name ;        
    }

    

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._samplesService);

        this._samplesService.onSampleChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(samples => {
                this.samples = samples;

                this.checkboxes = {};
                samples.map(sample => {
                    this.checkboxes[sample.id] = false;
                });
            });

        this._samplesService.onSelectedSamplesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedSamples => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedSamples.includes(id);
                }
                this.selectedSamples = selectedSamples;
            });

        

        this._samplesService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._samplesService.deselectSamples();
            });

        this._zoneService.getZones().then(data => this.zones = data) ;
        
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
     * Edit sample
     *
     * @param sample
     */
    editSample(sample): void
    {
        this.dialogRef = this._matDialog.open(SampleFormDialogComponent, {
            panelClass: 'sample-form-dialog',
            data      : {
                sample: sample,
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
                        this._samplesService.updateSample(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteSample(sample);

                        break;
                }
            });
    }

    /**
     * Delete sample
     */
    deleteSample(sample): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._samplesService.deleteSample(sample);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param sampleId
     */
    onSelectedChange(sampleId): void
    {
        this._samplesService.toggleSelectedSample(sampleId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ZoneService} _samplesService
     */
    constructor(
        private _samplesService: SampleService
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
        return this._samplesService.onSampleChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
