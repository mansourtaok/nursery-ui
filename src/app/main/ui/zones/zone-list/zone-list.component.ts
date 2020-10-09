import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { ZoneService } from '../zones.service';
import { ZoneFormDialogComponent } from '../zone-form/zone-form.component';
import { StocksService } from '../../stocks/stocks.service';
import { Stock } from '../../stocks/stock.model';
import { Seeding } from '../../seeding/seeding.model';
import { SeedingService } from '../../seeding/seeding.service';

@Component({
    selector     : 'zones-zone-list',
    templateUrl  : './zone-list.component.html',
    styleUrls    : ['./zone-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class ZoneListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    zones: any;
    stocks : Stock[];
    seedingList :Seeding[];
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name', 'seeding', 'stock','description',  'buttons'];
    selectedZones: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

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
        private _stockService: StocksService,
        private _seedingService : SeedingService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    stockName(stockId):string {
        return this.stocks.find(s => s.id == stockId).name ;        
    }

    seedingName(seedingId):string{
        return this.seedingList.find(s => s.id == seedingId).name ;
    }

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._zoneService);

        this._zoneService.onZoneChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(zones => {
                this.zones = zones;

                this.checkboxes = {};
                zones.map(zone => {
                    this.checkboxes[zone.id] = false;
                });
            });

        this._zoneService.onSelectedZonesChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedZones => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedZones.includes(id);
                }
                this.selectedZones = selectedZones;
            });

        

        this._zoneService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._zoneService.deselectZones();
            });

        this._stockService.getStocks().then(data => this.stocks = data) ;
        this._seedingService.getSeedings().then(data => this.seedingList = data) ;
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
     * Edit zone
     *
     * @param zone
     */
    editZone(zone): void
    {
        this.dialogRef = this._matDialog.open(ZoneFormDialogComponent, {
            panelClass: 'zone-form-dialog',
            data      : {
                zone: zone,
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
                        this._zoneService.updateZone(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteZone(zone);

                        break;
                }
            });
    }

    /**
     * Delete zone
     */
    deleteZone(zone): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                this._zoneService.deleteZone(zone);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param zoneId
     */
    onSelectedChange(zoneId): void
    {
        this._zoneService.toggleSelectedZone(zoneId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {ZoneService} _zoneService
     */
    constructor(
        private _zoneService: ZoneService
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
        return this._zoneService.onZoneChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
