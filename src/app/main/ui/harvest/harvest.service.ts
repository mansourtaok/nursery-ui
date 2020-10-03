import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Harvest } from 'app/main/ui/harvest/harvest.model';

@Injectable()
export class HarvestService implements Resolve<any>
{
    onHarvestChanged: BehaviorSubject<any>;
    onSelectedHarvestChanged: BehaviorSubject<any>;    
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    harvestList: Harvest[];    
    selectedHarvests: string[] = [];

    searchText: string;
    filterBy: string;

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {
        // Set the defaults
        this.onHarvestChanged = new BehaviorSubject([]);
        this.onSelectedHarvestChanged = new BehaviorSubject([]);        
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
                this.getHarvests(),                
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getHarvests();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getHarvests();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get harvests
     *
     * @returns {Promise<any>}
     */
    getHarvests(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get('http://localhost:8080/api/v1/nursery/harvest/all')
                    .subscribe((response: any) => {

                        this.harvestList = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.harvestList = FuseUtils.filterArrayByString(this.harvestList, this.searchText);
                        }

                        this.harvestList = this.harvestList.map(harvest => {
                            return new Harvest(harvest);
                        });

                        this.onHarvestChanged.next(this.harvestList);
                        resolve(this.harvestList);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected harvest by id
     *
     * @param id
     */
    toggleSelectedHarvest(id): void
    {
        // First, check if we already have that harvest as selected...
        if ( this.selectedHarvests.length > 0 )
        {
            const index = this.selectedHarvests.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedHarvests.splice(index, 1);

                // Trigger the next event
                this.onSelectedHarvestChanged.next(this.selectedHarvests);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedHarvests.push(id);

        // Trigger the next event
        this.onSelectedHarvestChanged.next(this.selectedHarvests);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedHarvests.length > 0 )
        {
            this.deselectHarvests();
        }
        else
        {
            this.selectHarvests();
        }
    }

    /**
     * Select harvests
     *
     * @param filterParameter
     * @param filterValue
     */
    selectHarvests(filterParameter?, filterValue?): void
    {
        this.selectedHarvests = [];

        // If there is no filter, select all harvests
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedHarvests = [];
            this.harvestList.map(harvest => {
                this.selectedHarvests.push(harvest.id);
            });
        }

        // Trigger the next event
        this.onSelectedHarvestChanged.next(this.selectedHarvests);
    }

    /**
     * Update harvest
     *
     * @param harvest
     * @returns {Promise<any>}
     */
    updateHarvest(harvest): Promise<any>
    {
        return new Promise((resolve, reject) => {

            if(harvest.id == -1){
                this._httpClient.put('http://localhost:8080/api/v1/nursery/harvest', {...harvest})
                .subscribe(response => {
                    this.getHarvests();
                    resolve(response);
                });
            }else{
                this._httpClient.post('http://localhost:8080/api/v1/nursery/harvest/' + harvest.id, {...harvest})
                .subscribe(response => {
                    this.getHarvests();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect harvests
     */
    deselectHarvests(): void
    {
        this.selectedHarvests = [];

        // Trigger the next event
        this.onSelectedHarvestChanged.next(this.selectedHarvests);
    }

    /**
     * Delete harvest
     *
     * @param harvest
     */
    deleteHarvest(harvest): void
    {
        this._httpClient.delete('http://localhost:8080/api/v1/nursery/harvest/' + harvest.id).subscribe(data => {
            const harvestIndex = this.harvestList.indexOf(harvest);
            this.harvestList.splice(harvestIndex, 1);
            this.onHarvestChanged.next(this.harvestList);    
        });
    }

    /**
     * Delete selected harvests
     */
    deleteSelectedHarvest(): void
    {
        let ids : string =  this.selectedHarvests.join(',')
        this._httpClient.delete('http://localhost:8080/api/v1/nursery/harvest/' +ids).subscribe(data => {

            for ( const harvestId of this.selectedHarvests )
            {
                const harvest = this.harvestList.find(_harvest => {
                    return _harvest.id === harvestId;
                });
                const harvestIndex = this.harvestList.indexOf(harvest);
                this.harvestList.splice(harvestIndex, 1);
            }
            this.onHarvestChanged.next(this.harvestList);
            this.deselectHarvests();
        });
    }

}
