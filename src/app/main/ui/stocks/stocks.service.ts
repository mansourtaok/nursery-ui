import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

import { FuseUtils } from '@fuse/utils';

import { Stock } from 'app/main/ui/stocks/stock.model';
import { environment } from './../../../../environments/environment';

@Injectable()
export class StocksService implements Resolve<any>
{

    
    onStocksChanged: BehaviorSubject<any>;
    onSelectedStocksChanged: BehaviorSubject<any>;    
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;

    stocks: Stock[];    
    selectedStocks: string[] = [];

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
        this.onStocksChanged = new BehaviorSubject([]);
        this.onSelectedStocksChanged = new BehaviorSubject([]);        
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
                this.getStocks(),                
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getStocks();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getStocks();
                    });

                    resolve();

                },
                reject
            );
        });
    }

    /**
     * Get stocks
     *
     * @returns {Promise<any>}
     */
    getStocks(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get(environment.apiUrl + '/api/v1/nursery/stocks')
                    .subscribe((response: any) => {

                        this.stocks = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.stocks = FuseUtils.filterArrayByString(this.stocks, this.searchText);
                        }

                        this.stocks = this.stocks.map(stock => {
                            return new Stock(stock);
                        });

                        this.onStocksChanged.next(this.stocks);
                        resolve(this.stocks);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected stock by id
     *
     * @param id
     */
    toggleSelectedStock(id): void
    {
        // First, check if we already have that stock as selected...
        if ( this.selectedStocks.length > 0 )
        {
            const index = this.selectedStocks.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedStocks.splice(index, 1);

                // Trigger the next event
                this.onSelectedStocksChanged.next(this.selectedStocks);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedStocks.push(id);

        // Trigger the next event
        this.onSelectedStocksChanged.next(this.selectedStocks);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedStocks.length > 0 )
        {
            this.deselectStocks();
        }
        else
        {
            this.selectStocks();
        }
    }

    /**
     * Select stocks
     *
     * @param filterParameter
     * @param filterValue
     */
    selectStocks(filterParameter?, filterValue?): void
    {
        this.selectedStocks = [];

        // If there is no filter, select all stocks
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedStocks = [];
            this.stocks.map(stock => {
                this.selectedStocks.push(stock.id);
            });
        }

        // Trigger the next event
        this.onSelectedStocksChanged.next(this.selectedStocks);
    }

    /**
     * Update stock
     *
     * @param stock
     * @returns {Promise<any>}
     */
    updateStock(stock): Promise<any>
    {
        return new Promise((resolve, reject) => {

            if(stock.id == -1){
                this._httpClient.put(environment.apiUrl +'/api/v1/nursery/stock', {...stock})
                .subscribe(response => {
                    this.getStocks();
                    resolve(response);
                });
            }else{
                this._httpClient.post(environment.apiUrl +'/api/v1/nursery/stock/' + stock.id, {...stock})
                .subscribe(response => {
                    this.getStocks();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect stocks
     */
    deselectStocks(): void
    {
        this.selectedStocks = [];

        // Trigger the next event
        this.onSelectedStocksChanged.next(this.selectedStocks);
    }

    /**
     * Delete stock
     *
     * @param stock
     */
    deleteStock(stock): void
    {
        this._httpClient.delete(environment.apiUrl +'/api/v1/nursery/stock/' + stock.id).subscribe(data => {
            const stockIndex = this.stocks.indexOf(stock);
            this.stocks.splice(stockIndex, 1);
            this.onStocksChanged.next(this.stocks);    
        });
    }

    /**
     * Delete selected stocks
     */
    deleteSelectedStocks(): void
    {
        let ids : string =  this.selectedStocks.join(',')
        this._httpClient.delete(environment.apiUrl +'/api/v1/nursery/stock/' +ids).subscribe(data => {

            for ( const stockId of this.selectedStocks )
            {
                const stock = this.stocks.find(_stock => {
                    return _stock.id === stockId;
                });
                const stockIndex = this.stocks.indexOf(stock);
                this.stocks.splice(stockIndex, 1);
            }
            this.onStocksChanged.next(this.stocks);
            this.deselectStocks();
        });
    }

}
