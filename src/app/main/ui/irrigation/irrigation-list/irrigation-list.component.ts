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
import { IrrigationService } from '../irrigation.service';
import { IrrigationFormDialogComponent } from '../irrigation-form/irrigation-form.component';

@Component({
    selector     : 'irrigations-irrigation-list',
    templateUrl  : './irrigation-list.component.html',
    styleUrls    : ['./irrigation-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class IrrigationListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    irrigations: any;
    stocks : Stock[];
    
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'remarks',  'stock','irrigationDate',  'buttons'];
    selectedIrrigations: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {IrrigationService} _irrigationService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _irrigationService: IrrigationService,
        private _stockService: StocksService,        
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


    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._irrigationService);

        this._irrigationService.onIrrigationChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(irrigations => {
                this.irrigations = irrigations;

                this.checkboxes = {};
                irrigations.map(irrigation => {
                    this.checkboxes[irrigation.id] = false;
                });
            });

        this._irrigationService.onSelectedIrrigationsChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedIrrigations => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedIrrigations.includes(id);
                }
                this.selectedIrrigations = selectedIrrigations;
            });

        

        this._irrigationService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._irrigationService.deselectIrrigations();
            });

        this._stockService.getStocks().then(data => this.stocks = data) ;
        
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
     * Edit irrigation
     *
     * @param irrigation
     */
    editIrrigation(irrigation): void
    {
        this.dialogRef = this._matDialog.open(IrrigationFormDialogComponent, {
            panelClass: 'irrigation-form-dialog',
            data      : {
                irrigation: irrigation,
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
                        this._irrigationService.updateIrrigation(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteIrrigation(irrigation);

                        break;
                }
            });
    }

    /**
     * Delete irrigation
     */
    deleteIrrigation(irrigation): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {                
                this._irrigationService.deleteIrrigation(irrigation);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param irrigationId
     */
    onSelectedChange(irrigationId): void
    {
        this._irrigationService.toggleSelectedIrrigation(irrigationId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {IrrigationService} _irrigationService
     */
    constructor(
        private _irrigationService: IrrigationService
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
        return this._irrigationService.onIrrigationChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
