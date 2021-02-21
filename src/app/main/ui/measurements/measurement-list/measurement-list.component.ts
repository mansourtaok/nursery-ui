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
import { ZoneService } from '../../zones/zones.service';
import { Zone } from '../../zones/zone.model';
import { Sample } from '../../samples/sample.model';
import { MeasurementService } from '../measurement.service';
import { SampleService } from '../../samples/sample.service';
import { MeasurementFormDialogComponent } from '../measurement-form/measurement-form.component';


@Component({
    selector     : 'measurement-list',
    templateUrl  : './measurement-list.component.html',
    styleUrls    : ['./measurement-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class MeasurementListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    measurements: any;
    samples : Sample[];
    
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name', 'sample','measurementDate','ph','ec','weight','height', 'buttons'];
    selectedMeasurements: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    
    constructor(
        private _measurementService : MeasurementService,
        private _samplesService: SampleService,          
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    sampleName(sampleId):string {
        return this.samples.find(s => s.id == sampleId).name ;        
    }

    

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._measurementService);

        this._measurementService.onMeasurementChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(measurements => {
                this.measurements = measurements;

                this.checkboxes = {};
                measurements.map(measurement => {
                    this.checkboxes[measurement.id] = false;
                });
            });

        this._measurementService.onSelectedMeaurementsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedMeasurements => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedMeasurements.includes(id);
                }
                this.selectedMeasurements = selectedMeasurements;
            });

        

        this._measurementService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._measurementService.deselectMeasurements();
            });

        this._samplesService.getSamples().then(data => this.samples = data) ;
        
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
     * Edit measurement
     *
     * @param measurement
     */
    editMeasurement(measurement): void
    {
        this.dialogRef = this._matDialog.open(MeasurementFormDialogComponent, {
            panelClass: 'measurement-form-dialog',
            data      : {
                measurement: measurement,
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
                        this._measurementService.updateMeasurement(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteMeasurement(measurement);

                        break;
                }
            });
    }

    /**
     * Delete measurement
     */
    deleteMeasurement(measurement): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._measurementService.deleteMeasurement(measurement);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param measurementId
     */
    onSelectedChange(measurementId): void
    {
        this._measurementService.toggleSelectedMeasurement(measurementId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {MeasurementService} _measurementService
     */
    constructor(
        private _measurementService: MeasurementService
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
        return this._measurementService.onMeasurementChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
