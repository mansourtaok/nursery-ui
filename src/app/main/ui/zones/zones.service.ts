import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Zone } from './zone.model';
import { environment } from './../../../../environments/environment';
import { DatePipe } from '@angular/common';

@Injectable()
export class ZoneService implements Resolve<any>
{
    onZoneChanged: BehaviorSubject<any>;
    onSelectedZonesChanged: BehaviorSubject<any>;    
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    mansourtaok:boolean;

    zones: Zone[];    
    selectedZones: string[] = [];

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
        this.onZoneChanged = new BehaviorSubject([]);
        this.onSelectedZonesChanged = new BehaviorSubject([]);        
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
                this.getZones(),                
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getZones();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getZones();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get zones
     *
     * @returns {Promise<any>}
     */
    getZones(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get(environment.apiUrl + '/api/v1/nursery/zones')
                    .subscribe((response: any) => {

                        this.zones = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.zones = FuseUtils.filterArrayByString(this.zones, this.searchText);
                        }

                        this.zones = this.zones.map(zone => {
                            return new Zone(zone);
                        });

                        this.onZoneChanged.next(this.zones);
                        resolve(this.zones);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected zone by id
     *
     * @param id
     */
    toggleSelectedZone(id): void
    {
        // First, check if we already have that zone as selected...
        if ( this.selectedZones.length > 0 )
        {
            const index = this.selectedZones.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedZones.splice(index, 1);

                // Trigger the next event
                this.onSelectedZonesChanged.next(this.selectedZones);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedZones.push(id);

        // Trigger the next event
        this.onSelectedZonesChanged.next(this.selectedZones);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedZones.length > 0 )
        {
            this.deselectZones();
        }
        else
        {
            this.selectZones();
        }
    }

    /**
     * Select zones
     *
     * @param filterParameter
     * @param filterValue
     */
    selectZones(filterParameter?, filterValue?): void
    {
        this.selectedZones = [];

        // If there is no filter, select all zones
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedZones = [];
            this.zones.map(zone => {
                this.selectedZones.push(zone.id);
            });
        }

        // Trigger the next event
        this.onSelectedZonesChanged.next(this.selectedZones);
    }

    /**
     * Update zone
     *
     * @param zone
     * @returns {Promise<any>}
     */
    updateZone(zone): Promise<any>
    {
        return new Promise((resolve, reject) => {

            zone.seedingDate =  this._datePipe.transform(zone.seedingDate, 'yyyy-MM-dd') ;

            if(zone.id == -1){
                this._httpClient.put(environment.apiUrl + '/api/v1/nursery/zone', {...zone})
                .subscribe(response => {
                    this.getZones();
                    resolve(response);
                });
            }else{
                this._httpClient.post(environment.apiUrl + '/api/v1/nursery/zone/' + zone.id, {...zone})
                .subscribe(response => {
                    this.getZones();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect zones
     */
    deselectZones(): void
    {
        this.selectedZones = [];

        // Trigger the next event
        this.onSelectedZonesChanged.next(this.selectedZones);
    }

    /**
     * Delete zone
     *
     * @param zone
     */
    deleteZone(zone): void
    {
        this._httpClient.delete(environment.apiUrl + '/api/v1/nursery/zone/' + zone.id).subscribe(data => {
            const zoneIndex = this.zones.indexOf(zone);
            this.zones.splice(zoneIndex, 1);
            this.onZoneChanged.next(this.zones);    
        },error =>{
            alert('An Unexpected Error Occured.');  
            console.log(error);  
        });
    }

    /**
     * Delete selected zones
     */
    deleteSelectedZones(): void
    {
        let ids : string =  this.selectedZones.join(',')
        this._httpClient.delete(environment.apiUrl + '/api/v1/nursery/zone/' +ids).subscribe(data => {

            for ( const zoneId of this.selectedZones )
            {
                const zone = this.zones.find(_zone => {
                    return _zone.id === zoneId;
                });
                const zoneIndex = this.zones.indexOf(zone);
                this.zones.splice(zoneIndex, 1);
            }
            this.onZoneChanged.next(this.zones);
            this.deselectZones();
        });
    }

}