import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Species } from './species.model';

@Injectable()
export class SpeciesService implements Resolve<any>
{
    onSpeciesChanged: BehaviorSubject<any>;
    onSelectedSpeciesChanged: BehaviorSubject<any>;    
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    mansourtaok:boolean;

    speciesList: Species[];    
    selectedSpecies: string[] = [];

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
        this.onSpeciesChanged = new BehaviorSubject([]);
        this.onSelectedSpeciesChanged = new BehaviorSubject([]);        
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
                this.getSpecies()
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getSpecies();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getSpecies();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get species
     *
     * @returns {Promise<any>}
     */
    getSpecies(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get('http://localhost:8080/api/v1/nursery/species/all')
                    .subscribe((response: any) => {

                        this.speciesList = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.speciesList = FuseUtils.filterArrayByString(this.speciesList, this.searchText);
                        }

                        this.speciesList = this.speciesList.map(species => {
                            return new Species(species);
                        });

                        this.onSpeciesChanged.next(this.speciesList);
                        resolve(this.speciesList);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected species by id
     *
     * @param id
     */
    toggleSelectedSpecies(id): void
    {
        // First, check if we already have that species as selected...
        if ( this.selectedSpecies.length > 0 )
        {
            const index = this.selectedSpecies.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedSpecies.splice(index, 1);

                // Trigger the next event
                this.onSelectedSpeciesChanged.next(this.selectedSpecies);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedSpecies.push(id);

        // Trigger the next event
        this.onSelectedSpeciesChanged.next(this.selectedSpecies);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedSpecies.length > 0 )
        {
            this.deselectSpecies();
        }
        else
        {
            this.selectSpecies();
        }
    }

    /**
     * Select species
     *
     * @param filterParameter
     * @param filterValue
     */
    selectSpecies(filterParameter?, filterValue?): void
    {
        this.selectedSpecies = [];

        // If there is no filter, select all species
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedSpecies = [];
            this.speciesList.map(species => {
                this.selectedSpecies.push(species.id);
            });
        }

        // Trigger the next event
        this.onSelectedSpeciesChanged.next(this.selectedSpecies);
    }

    /**
     * Update species
     *
     * @param species
     * @returns {Promise<any>}
     */
    updateSpecies(species): Promise<any>
    {
        return new Promise((resolve, reject) => {

            if(species.id == -1){
                this._httpClient.put('http://localhost:8080/api/v1/nursery/species', {...species})
                .subscribe(response => {
                    this.getSpecies();
                    resolve(response);
                });
            }else{
                this._httpClient.post('http://localhost:8080/api/v1/nursery/species/' + species.id, {...species})
                .subscribe(response => {
                    this.getSpecies();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect species
     */
    deselectSpecies(): void
    {
        this.selectedSpecies = [];

        // Trigger the next event
        this.onSelectedSpeciesChanged.next(this.selectedSpecies);
    }

    /**
     * Delete species
     *
     * @param species
     */
    deleteSpecies(species): void
    {
        this._httpClient.delete('http://localhost:8080/api/v1/nursery/species/' + species.id).subscribe(data => {
            const speciesIndex = this.speciesList.indexOf(species);
            this.speciesList.splice(speciesIndex, 1);
            this.onSpeciesChanged.next(this.speciesList);    
        });
    }

    /**
     * Delete selected speciesList
     */
    deleteSelectedSpecies(): void
    {
        let ids : string =  this.selectedSpecies.join(',')
        this._httpClient.delete('http://localhost:8080/api/v1/nursery/species/' +ids).subscribe(data => {

            for ( const speciesId of this.selectedSpecies )
            {
                const species = this.speciesList.find(_species => {
                    return _species.id === speciesId;
                });
                const speciesIndex = this.speciesList.indexOf(species);
                this.speciesList.splice(speciesIndex, 1);
            }
            this.onSpeciesChanged.next(this.speciesList);
            this.deselectSpecies();
        });
    }

}