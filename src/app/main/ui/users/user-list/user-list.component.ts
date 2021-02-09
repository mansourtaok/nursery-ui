import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';


import { StocksService } from '../../stocks/stocks.service';
import { Stock } from '../../stocks/stock.model';
import { Seeding } from '../../seeding/seeding.model';
import { SeedingService } from '../../seeding/seeding.service';
import { UserService } from '../user.service';
import { UserFormDialogComponent } from '../user-form/user-form.component';

@Component({
    selector     : 'users-user-list',
    templateUrl  : './user-list.component.html',
    styleUrls    : ['./user-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class UserListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    users: any;
    
    
    
    dataSource: FilesDataSource | null;
    displayedColumns = ['checkbox', 'name',  'email',  'buttons'];
    selectedUsers: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    /**
     * Constructor
     *
     * @param {UserService} _userService
     * @param {MatDialog} _matDialog
     */
    constructor(
        private _userService: UserService,
        public _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------



    /**
     * On init
     */
    ngOnInit(): void
    {
        this.dataSource = new FilesDataSource(this._userService);

        this._userService.onUserChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(users => {
                this.users = users;

                this.checkboxes = {};
                users.map(user => {
                    this.checkboxes[user.id] = false;
                });
            });

        this._userService.onSelectedUsersChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(selectedUsers => {
                for ( const id in this.checkboxes )
                {
                    if ( !this.checkboxes.hasOwnProperty(id) )
                    {
                        continue;
                    }

                    this.checkboxes[id] = selectedUsers.includes(id);
                }
                this.selectedUsers = this.selectedUsers;
            });

        

        this._userService.onFilterChanged
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this._userService.deselectUsers();
            });

        this._userService.getUsers().then(data => this.users = data) ;
        
    }
    

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Edit user
     *
     * @param user
     */
    editUser(user): void
    {
        this.dialogRef = this._matDialog.open(UserFormDialogComponent, {
            panelClass: 'user-form-dialog',
            data      : {
                user: user,
                action : 'edit'
            }
        });

        this.dialogRef.afterClosed()
            .subscribe(response => {
                if ( !response )
                {
                    return;
                }
                const actionType: string = response[0];
                const formData: FormGroup = response[1];
                switch ( actionType )
                {
                    /**
                     * Save
                     */
                    case 'save':
                        this._userService.updateUser(formData.getRawValue());

                        break;
                    /**
                     * Delete
                     */
                    case 'delete':

                        this.deleteUser(user);

                        break;
                }
            });
    }

    /**
     * Delete user
     */
    deleteUser(user): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {                
                this._userService.deleteUser(user);
            }
            this.confirmDialogRef = null;
        });

    }

    /**
     * On selected change
     *
     * @param userId
     */
    onSelectedChange(userId): void
    {
        this._userService.toggleSelectedUser(userId);
    }

    
}

export class FilesDataSource extends DataSource<any>
{
    /**
     * Constructor
     *
     * @param {UserService} _userService
     */
    constructor(
        private _userService: UserService
    )
    {
        super();
    }

    /**
     * Connect function called by the table to retrieve one stream containing the data to render.
     * @returns {Observable<any[]>}
     */
    connect(): Observable<any[]>
    {
        return this._userService.onUserChanged;
    }

    /**
     * Disconnect
     */
    disconnect(): void
    {
    }
}
