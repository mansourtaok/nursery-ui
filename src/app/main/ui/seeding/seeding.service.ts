import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Seeding } from './seeding.model';
import { DatePipe } from '@angular/common';
import { environment } from './../../../../environments/environment';

@Injectable()
export class SeedingService implements Resolve<any>
{
    onSeedingChanged: BehaviorSubject<any>;
    onSelectedSeedingChanged: BehaviorSubject<any>;    
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    seedingList: Seeding[];    
    selectedSeedings: string[] = [];

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
        this.onSeedingChanged = new BehaviorSubject([]);
        this.onSelectedSeedingChanged = new BehaviorSubject([]);        
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
                this.getSeedings(),                
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getSeedings();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getSeedings();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get seedings
     *
     * @returns {Promise<any>}
     */
    getSeedings(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get(environment.apiUrl + '/api/v1/nursery/seedings')
                    .subscribe((response: any) => {

                        this.seedingList = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.seedingList = FuseUtils.filterArrayByString(this.seedingList, this.searchText);
                        }

                        this.seedingList = this.seedingList.map(seeding => {
                            return new Seeding(seeding);
                        });

                        this.onSeedingChanged.next(this.seedingList);
                        resolve(this.seedingList);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected seeding by id
     *
     * @param id
     */
    toggleSelectedSeeding(id): void
    {
        // First, check if we already have that seeding as selected...
        if ( this.selectedSeedings.length > 0 )
        {
            const index = this.selectedSeedings.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedSeedings.splice(index, 1);

                // Trigger the next event
                this.onSelectedSeedingChanged.next(this.selectedSeedings);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedSeedings.push(id);

        // Trigger the next event
        this.onSelectedSeedingChanged.next(this.selectedSeedings);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedSeedings.length > 0 )
        {
            this.deselectSeedings();
        }
        else
        {
            this.selectSeedings();
        }
    }

    /**
     * Select seedings
     *
     * @param filterParameter
     * @param filterValue
     */
    selectSeedings(filterParameter?, filterValue?): void
    {
        this.selectedSeedings = [];

        // If there is no filter, select all seedings
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedSeedings = [];
            this.seedingList.map(seeding => {
                this.selectedSeedings.push(seeding.id);
            });
        }

        // Trigger the next event
        this.onSelectedSeedingChanged.next(this.selectedSeedings);
    }

    /**
     * Update seeding
     *
     * @param seeding
     * @returns {Promise<any>}
     */
    updateSeeding(seeding): Promise<any>
    {
        return new Promise((resolve, reject) => {

            seeding.transplantingDate =  this._datePipe.transform(seeding.transplantingDate, 'yyyy-MM-dd') ;
            seeding.preSeedingDate =  this._datePipe.transform(seeding.preSeedingDate, 'yyyy-MM-dd') ;
            seeding.directSeedingDate =  this._datePipe.transform(seeding.directSeedingDate, 'yyyy-MM-dd') ;
            
            if(seeding.id == -1){
                this._httpClient.put(environment.apiUrl + '/api/v1/nursery/seeding', {...seeding})
                .subscribe(response => {
                    this.getSeedings();
                    resolve(response);
                });
            }else{
                
                this._httpClient.post(environment.apiUrl + '/api/v1/nursery/seeding/' + seeding.id, {...seeding})
                .subscribe(response => {
                    this.getSeedings();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect seedings
     */
    deselectSeedings(): void
    {
        this.selectedSeedings = [];

        // Trigger the next event
        this.onSelectedSeedingChanged.next(this.selectedSeedings);
    }

    /**
     * Delete seeding
     *
     * @param seeding
     */
    deleteSeeding(seeding): void
    {
        this._httpClient.delete(environment.apiUrl + '/api/v1/nursery/seeding/' + seeding.id).subscribe(data => {
            const seedingIndex = this.seedingList.indexOf(seeding);
            this.seedingList.splice(seedingIndex, 1);
            this.onSeedingChanged.next(this.seedingList);    
        });
    }

    /**
     * Delete selected seedings
     */
    deleteSelectedSeeding(): void
    {
        let ids : string =  this.selectedSeedings.join(',')
        this._httpClient.delete(environment.apiUrl + '/api/v1/nursery/seeding/' +ids).subscribe(data => {

            for ( const seedingId of this.selectedSeedings )
            {
                const seeding = this.seedingList.find(_seeding => {
                    return _seeding.id === seedingId;
                });
                const seedingIndex = this.seedingList.indexOf(seeding);
                this.seedingList.splice(seedingIndex, 1);
            }
            this.onSeedingChanged.next(this.seedingList);
            this.deselectSeedings();
        });
    }

}
