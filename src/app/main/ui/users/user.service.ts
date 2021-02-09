import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, Observable, Subject } from 'rxjs';


import { FuseUtils } from '@fuse/utils';
import { environment } from './../../../../environments/environment';
import { DatePipe } from '@angular/common';
import { User } from './user.model';

@Injectable()
export class UserService implements Resolve<any>
{
    onUserChanged: BehaviorSubject<any>;
    onSelectedUsersChanged: BehaviorSubject<any>;
    onSearchTextChanged: Subject<any>;
    onFilterChanged: Subject<any>;
    

    users: User[] ;
    selectedUsers: string[] = [];

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
        this.onUserChanged = new BehaviorSubject([]);
        this.onSelectedUsersChanged = new BehaviorSubject([]);        
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
                this.getUsers(),                
            ]).then(
                ([files]) => {

                    this.onSearchTextChanged.subscribe(searchText => {
                        this.searchText = searchText;
                        this.getUsers();
                    });

                    this.onFilterChanged.subscribe(filter => {
                        this.filterBy = filter;
                        this.getUsers();
                    });

                    resolve(null);

                },
                reject
            );
        });
    }

    /**
     * Get users
     *
     * @returns {Promise<any>}
     */
    getUsers(): Promise<any>
    {
        return new Promise((resolve, reject) => {
            
                this._httpClient.get(environment.apiUrl + '/api/v1/nursery/users')
                    .subscribe((response: any) => {

                        this.users = response;

                        

                        if ( this.searchText && this.searchText !== '' )
                        {
                            this.users = FuseUtils.filterArrayByString(this.users, this.searchText);
                        }

                        this.users = this.users.map(user => {
                            return new User(user);
                        });

                        this.onUserChanged.next(this.users);
                        resolve(this.users);
                    }, reject);
            }
        );
    }


    /**
     * Toggle selected user by id
     *
     * @param id
     */
    toggleSelectedUser(id): void
    {
        // First, check if we already have that user as selected...
        if ( this.selectedUsers.length > 0 )
        {
            const index = this.selectedUsers.indexOf(id);

            if ( index !== -1 )
            {
                this.selectedUsers.splice(index, 1);

                // Trigger the next event
                this.onSelectedUsersChanged.next(this.selectedUsers);

                // Return
                return;
            }
        }

        // If we don't have it, push as selected
        this.selectedUsers.push(id);

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Toggle select all
     */
    toggleSelectAll(): void
    {
        if ( this.selectedUsers.length > 0 )
        {
            this.deselectUsers() ;
        }
        else
        {
            this.selectUsers() ;
        }
    }

    /**
     * Select users
     *
     * @param filterParameter
     * @param filterValue
     */
    selectUsers(filterParameter?, filterValue?): void
    {
        this.selectedUsers = [];

        // If there is no filter, select all users
        if ( filterParameter === undefined || filterValue === undefined )
        {
            this.selectedUsers = [];
            this.users.map(user => {
                this.selectedUsers.push(user.id);
            });
        }

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Update user
     *
     * @param user
     * @returns {Promise<any>}
     */
    updateUser(user): Promise<any>
    {
        return new Promise((resolve, reject) => {

            

            if(user.id == -1){
                this._httpClient.put(environment.apiUrl + '/api/v1/nursery/user', {...user})
                .subscribe(response => {
                    this.getUsers();
                    resolve(response);
                });
            }else{
                this._httpClient.post(environment.apiUrl + '/api/v1/nursery/user/' + user.id, {...user})
                .subscribe(response => {
                    this.getUsers();
                    resolve(response);
                });
            }

            
        });
    }


    /**
     * Deselect users
     */
    deselectUsers(): void
    {
        this.selectedUsers = [];

        // Trigger the next event
        this.onSelectedUsersChanged.next(this.selectedUsers);
    }

    /**
     * Delete user
     *
     * @param user
     */
    deleteUser(user): void
    {
        this._httpClient.delete(environment.apiUrl + '/api/v1/nursery/user/' + user.id).subscribe(data => {
            const userIndex = this.users.indexOf(user);
            this.users.splice(userIndex, 1);
            this.onUserChanged.next(this.users);    
        },error =>{
            alert('An Unexpected Error Occured.');  
            console.log(error);  
        });
    }

    /**
     * Delete selected users
     */
    deleteSelectedUsers(): void
    {
        let ids : string =  this.selectedUsers.join(',')
        this._httpClient.delete(environment.apiUrl + '/api/v1/nursery/user/' +ids).subscribe(data => {

            for ( const userId of this.selectedUsers )
            {
                const user = this.users.find(_user => {
                    return _user.id === userId;
                });
                const userIndex = this.users.indexOf(user);
                this.users.splice(userIndex, 1);
            }
            this.onUserChanged.next(this.users);
            this.deselectUsers();
        });
    }

}