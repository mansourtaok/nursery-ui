import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Measurement } from './measurement.model';



@Injectable()
export class MeasurementService implements Resolve<any>
{
    onMeasurementChanged: BehaviorSubject<any>;
    onSelectedMeaurementsChanged: BehaviorSubject<any>;    
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    mansourtaok:boolean;

    measurements: Measurement[];    
    selectedMeasurements: string[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClientmea
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onMeasurementChanged = new BehaviorSubject([]);
        this.onSelectedMeaurementsChanged = new BehaviorSubject([]);        
        this.onSearchTextChanged = new Subject();
        this.onFilterChanged = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Resolver
     *
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<any> | Promise<any> | any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> | Promise<any> | any
    {
        return new Promise((resolve, reject) => {

            Promise.all([
                this.getMeasurements(),                
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getMeasurements();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getMeasurements();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get measurements
     *
     * @returns {Promise<any>}
     */
    getMeasurements(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get('http://localhost:8080/api/v1/nursery/measurements')
                    .subscribe((response: any) => {

                        this.measurements = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.measurements = FuseUtils.filterArrayByString(this.measurements, this.searchText);
                        }

                        this.measurements = this.measurements.map(measurement => {
                            return new Measurement(measurement);
                        });

                        this.onMeasurementChanged.next(this.measurements);
                        resolve(this.measurements);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected measurement by id
     *
     * @param id
     */
    toggleSelectedMeasurement(id): void
    {
        // First, check if we already have that measurement as selected...
        if ( this.selectedMeasurements.length > 0 )
        {
            const index = this.selectedMeasurements.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedMeasurements.splice(index, 1);

                // Trigger the next event
                this.onSelectedMeaurementsChanged.next(this.selectedMeasurements);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedMeasurements.push(id);

        // Trigger the next event
        this.onSelectedMeaurementsChanged.next(this.selectedMeasurements);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedMeasurements.length > 0 )
        {
            this.deselectMeasurements();
        }
        else
        {
            this.selectMeasurements();
        }
    }

    /**
     * Select measurements
     *
     * @param filterParameter
     * @param filterValue
     */
    selectMeasurements(filterParameter?, filterValue?): void
    {
        this.selectedMeasurements = [];

        // If there is no filter, select all measurements
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedMeasurements = [];
            this.measurements.map(measurement => {
                this.selectedMeasurements.push(measurement.id);
            });
        }

        // Trigger the next event
        this.onSelectedMeaurementsChanged.next(this.selectedMeasurements);
    }

    /**
     * Update measurement
     *
     * @param measurement
     * @returns {Promise<any>}
     */
    updateMeasurement(measurement): Promise<any>
    {
        return new Promise((resolve, reject) => {

            if(measurement.id == -1){
                this._httpClient.put('http://localhost:8080/api/v1/nursery/measurement', {...measurement})
                .subscribe(response => {
                    this.getMeasurements();
                    resolve(response);
                });
            }else{
                this._httpClient.post('http://localhost:8080/api/v1/nursery/measurement/' + measurement.id, {...measurement})
                .subscribe(response => {
                    this.getMeasurements();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect measurements
     */
    deselectMeasurements(): void
    {
        this.selectedMeasurements = [];

        // Trigger the next event
        this.onSelectedMeaurementsChanged.next(this.selectedMeasurements);
    }

    /**
     * Delete measurement
     *
     * @param measurement
     */
    deleteMeasurement(measurement): void
    {
        this._httpClient.delete('http://localhost:8080/api/v1/nursery/measurement/' + measurement.id).subscribe(data => {
            const measurementIndex = this.measurements.indexOf(measurement);
            this.measurements.splice(measurementIndex, 1);
            this.onMeasurementChanged.next(this.measurements);    
        });
    }

    /**
     * Delete selected measurements
     */
    deleteselectedMeasurements(): void
    {
        let ids : string =  this.selectedMeasurements.join(',')
        this._httpClient.delete('http://localhost:8080/api/v1/nursery/measurement/' +ids).subscribe(data => {

            for ( const measurementId of this.selectedMeasurements )
            {
                const measurement = this.measurements.find(_measurement=> {
                    return _measurement.id === measurementId;
                });
                const measurementIndex = this.measurements.indexOf(measurement);
                this.measurements.splice(measurementIndex, 1);
            }
            this.onMeasurementChanged.next(this.measurements);
            this.deselectMeasurements();
        });
    }

}