import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';
import { Sample } from './sample.model';


@Injectable()
export class SampleService implements Resolve<any>
{
    onSampleChanged: BehaviorSubject<any>;
    onSelectedSamplesChanged: BehaviorSubject<any>;    
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    mansourtaok:boolean;

    samples: Sample[];    
    selectedSamples: string[] = [];

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
        this.onSampleChanged = new BehaviorSubject([]);
        this.onSelectedSamplesChanged = new BehaviorSubject([]);        
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
                this.getSamples(),                
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getSamples();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getSamples();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get samples
     *
     * @returns {Promise<any>}
     */
    getSamples(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get('http://localhost:8080/api/v1/nursery/samples')
                    .subscribe((response: any) => {

                        this.samples = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.samples = FuseUtils.filterArrayByString(this.samples, this.searchText);
                        }

                        this.samples = this.samples.map(sample => {
                            return new Sample(sample);
                        });

                        this.onSampleChanged.next(this.samples);
                        resolve(this.samples);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected sample by id
     *
     * @param id
     */
    toggleSelectedSample(id): void
    {
        // First, check if we already have that sample as selected...
        if ( this.selectedSamples.length > 0 )
        {
            const index = this.selectedSamples.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedSamples.splice(index, 1);

                // Trigger the next event
                this.onSelectedSamplesChanged.next(this.selectedSamples);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedSamples.push(id);

        // Trigger the next event
        this.onSelectedSamplesChanged.next(this.selectedSamples);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedSamples.length > 0 )
        {
            this.deselectSamples();
        }
        else
        {
            this.selectSamples();
        }
    }

    /**
     * Select samples
     *
     * @param filterParameter
     * @param filterValue
     */
    selectSamples(filterParameter?, filterValue?): void
    {
        this.selectedSamples = [];

        // If there is no filter, select all samples
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedSamples = [];
            this.samples.map(sample => {
                this.selectedSamples.push(sample.id);
            });
        }

        // Trigger the next event
        this.onSelectedSamplesChanged.next(this.selectedSamples);
    }

    /**
     * Update sample
     *
     * @param sample
     * @returns {Promise<any>}
     */
    updateSample(sample): Promise<any>
    {
        return new Promise((resolve, reject) => {

            if(sample.id == -1){
                this._httpClient.put('http://localhost:8080/api/v1/nursery/sample', {...sample})
                .subscribe(response => {
                    this.getSamples();
                    resolve(response);
                });
            }else{
                this._httpClient.post('http://localhost:8080/api/v1/nursery/sample/' + sample.id, {...sample})
                .subscribe(response => {
                    this.getSamples();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect samples
     */
    deselectSamples(): void
    {
        this.selectedSamples = [];

        // Trigger the next event
        this.onSelectedSamplesChanged.next(this.selectedSamples);
    }

    /**
     * Delete sample
     *
     * @param sample
     */
    deleteSample(sample): void
    {
        this._httpClient.delete('http://localhost:8080/api/v1/nursery/sample/' + sample.id).subscribe(data => {
            const sampleIndex = this.samples.indexOf(sample);
            this.samples.splice(sampleIndex, 1);
            this.onSampleChanged.next(this.samples);    
        });
    }

    /**
     * Delete selected samples
     */
    deleteselectedSamples(): void
    {
        let ids : string =  this.selectedSamples.join(',')
        this._httpClient.delete('http://localhost:8080/api/v1/nursery/sample/' +ids).subscribe(data => {

            for ( const sampleId of this.selectedSamples )
            {
                const sample = this.samples.find(_sample=> {
                    return _sample.id === sampleId;
                });
                const sampleIndex = this.samples.indexOf(sample);
                this.samples.splice(sampleIndex, 1);
            }
            this.onSampleChanged.next(this.samples);
            this.deselectSamples();
        });
    }

}