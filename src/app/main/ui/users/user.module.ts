import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FuseSharedModule } from '@fuse/shared.module';
import { FuseConfirmDialogModule, FuseSidebarModule } from '@fuse/components';

import { MatSelectModule } from '@angular/material/select';
import { AuthenticationGuardService } from 'app/main/auth/authentication-guard.service';



import { UserFormDialogComponent } from './user-form/user-form.component';
import { UserService } from './user.service';
import { UserComponent } from './user.component';
import { UserListComponent } from './user-list/user-list.component';
import { UserSelectedBarComponent } from './selected-bar/selected-bar.component';


const routes: Routes = [    
    {
        path     : 'users',        
        component: UserComponent,
        resolve  : {
            users: UserService
        }
    }
];

@NgModule({
    declarations   : [
        UserComponent,
        UserListComponent,
        UserSelectedBarComponent,        
        UserFormDialogComponent
    ],
    imports        : [
        RouterModule.forChild(routes),

        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatRippleModule,
        MatTableModule,
        MatToolbarModule,
        MatSelectModule,
        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        UserService
    ],
    entryComponents: [
        UserFormDialogComponent
    ]
})
export class UserModule
{
}
