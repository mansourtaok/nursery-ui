import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


import { FuseUtils } from '@fuse/utils';
import { environment } from '../../../../environments/environment';
import { DatePipe } from '@angular/common';


@Injectable()
export class WeatherService 
{

    /**
     * Constructor
     *
     * @param {HttpClient} _httpClient
     */
    constructor(
        private _httpClient: HttpClient
    )
    {

    }

    getWeatherList(): Observable<any>
    {
        return this._httpClient.get(environment.apiUrl + '/api/v1/nursery/weather/all') ;
    }



}