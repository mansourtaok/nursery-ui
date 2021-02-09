import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { Irrigation } from './irrigation.model';
import { FuseUtils } from '@fuse/utils';
import { environment } from './../../../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable()
export class IrrigationService implements Resolve<any>
{
    onIrrigationChanged: BehaviorSubject<any>;
    onSelectedIrrigationsChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    

    irrigations: Irrigation[] ;
    selectedIrrigations: string[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient,
        private _datePipe : DatePipe
    )
    {
        // Set the defaults
        this.onIrrigationChanged = new BehaviorSubject([]);
        this.onSelectedIrrigationsChanged = new BehaviorSubject([]);        
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
                this.getIrrigations(),                
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getIrrigations();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getIrrigations();
                    });

                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get irrigations
     *
     * @returns {Promise<any>}
     */
    getIrrigations(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get(environment.apiUrl + '/api/v1/nursery/irrigations')
                    .subscribe((response: any) => {

                        this.irrigations = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.irrigations = FuseUtils.filterArrayByString(this.irrigations, this.searchText);
                        }

                        this.irrigations = this.irrigations.map(irrigation => {
                            return new Irrigation(irrigation);
                        });

                        this.onIrrigationChanged.next(this.irrigations);
                        resolve(this.irrigations);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected irrigation by id
     *
     * @param id
     */
    toggleSelectedIrrigation(id): void
    {
        // First, check if we already have that irrigation as selected...
        if ( this.selectedIrrigations.length > 0 )
        {
            const index = this.selectedIrrigations.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedIrrigations.splice(index, 1);

                // Trigger the next event
                this.onSelectedIrrigationsChanged.next(this.selectedIrrigations);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedIrrigations.push(id);

        // Trigger the next event
        this.onSelectedIrrigationsChanged.next(this.selectedIrrigations);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedIrrigations.length > 0 )
        {
            this.deselectIrrigations() ;
        }
        else
        {
            this.selectIrrigations() ;
        }
    }

    /**
     * Select irrigations
     *
     * @param filterParameter
     * @param filterValue
     */
    selectIrrigations(filterParameter?, filterValue?): void
    {
        this.selectedIrrigations = [];

        // If there is no filter, select all irrigations
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedIrrigations = [];
            this.irrigations.map(irrigation => {
                this.selectedIrrigations.push(irrigation.id);
            });
        }

        // Trigger the next event
        this.onSelectedIrrigationsChanged.next(this.selectedIrrigations);
    }

    /**
     * Update irrigation
     *
     * @param irrigation
     * @returns {Promise<any>}
     */
    updateIrrigation(irrigation): Promise<any>
    {
        return new Promise((resolve, reject) => {

            irrigation.irrigationDate =  this._datePipe.transform(irrigation.irrigationDate, 'yyyy-MM-dd') ;

            if(irrigation.id == -1){
                this._httpClient.put(environment.apiUrl + '/api/v1/nursery/irrigation', {...irrigation})
                .subscribe(response => {
                    this.getIrrigations();
                    resolve(response);
                });
            }else{
                this._httpClient.post(environment.apiUrl + '/api/v1/nursery/irrigation/' + irrigation.id, {...irrigation})
                .subscribe(response => {
                    this.getIrrigations();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect irrigations
     */
    deselectIrrigations(): void
    {
        this.selectedIrrigations = [];

        // Trigger the next event
        this.onSelectedIrrigationsChanged.next(this.selectedIrrigations);
    }

    /**
     * Delete irrigation
     *
     * @param irrigation
     */
    deleteIrrigation(irrigation): void
    {
        this._httpClient.delete(environment.apiUrl + '/api/v1/nursery/irrigation/' + irrigation.id).subscribe(data => {
            const irrigationIndex = this.irrigations.indexOf(irrigation);
            this.irrigations.splice(irrigationIndex, 1);
            this.onIrrigationChanged.next(this.irrigations);    
        },error =>{
            alert('An Unexpected Error Occured.');  
            console.log(error);  
        });
    }

    /**
     * Delete selected irrigations
     */
    deleteSelectedIrrigations(): void
    {
        let ids : string =  this.selectedIrrigations.join(',')
        this._httpClient.delete(environment.apiUrl + '/api/v1/nursery/irrigation/' +ids).subscribe(data => {

            for ( const irrigationId of this.selectedIrrigations )
            {
                const irrigation = this.irrigations.find(_irrigation => {
                    return _irrigation.id === irrigationId;
                });
                const irrigationIndex = this.irrigations.indexOf(irrigation);
                this.irrigations.splice(irrigationIndex, 1);
            }
            this.onIrrigationChanged.next(this.irrigations);
            this.deselectIrrigations();
        });
    }

}