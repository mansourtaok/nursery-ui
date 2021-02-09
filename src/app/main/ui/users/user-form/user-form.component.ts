import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeedingService } from '../../seeding/seeding.service';
import { StocksComponent } from '../../stocks/stocks.component';
import { StocksService } from '../../stocks/stocks.service';
import { User } from '../user.model';
import { UserService } from '../user.service';


@Component({
    selector     : 'users-user-form-dialog',
    templateUrl  : './user-form.component.html',
    styleUrls    : ['./user-form.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class UserFormDialogComponent
{
    action: string;
    user: User;
    userForm: FormGroup;
    dialogTitle: string;
    
    
    

    /**
     * Constructor
     *
     * @param {MatDialogRef<UserFormDialogComponent>} matDialogRef
     * @param _data
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        public matDialogRef: MatDialogRef<UserFormDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private _data: any,
        private _formBuilder: FormBuilder,
        private _userService: UserService
        
    )
    {
        // Set the defaults
        this.action = _data.action;

        if ( this.action === 'edit' )
        {
            this.dialogTitle = 'Edit User';
            this.user = _data.user;
        }
        else
        {
            this.dialogTitle = 'New User';
            this.user = new User({});
        }

        
        this.userForm = this.createUserForm();
        
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Create user form
     *
     * @returns {FormGroup}
     */
    createUserForm(): FormGroup
    {
        return this._formBuilder.group({
            id      : [this.user.id],
            name    : [this.user.name],            
            email :[this.user.email],                  
            password:[this.user.password]
            
        });
    }
}
