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
import { IrrigationComponent } from './irrigation.component';
import { IrrigationService } from './irrigation.service';
import { IrrigationListComponent } from './irrigation-list/irrigation-list.component';
import { IrrigationSelectedBarComponent } from './selected-bar/selected-bar.component';
import { IrrigationFormDialogComponent } from './irrigation-form/irrigation-form.component';


const routes: Routes = [    
    {
        path     : 'irrigations',        
        component: IrrigationComponent,
        resolve  : {
            irrigations: IrrigationService
        }
    }
];

@NgModule({
    declarations   : [
        IrrigationComponent,
        IrrigationListComponent,
        IrrigationSelectedBarComponent,        
        IrrigationFormDialogComponent
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
        IrrigationService
    ],
    entryComponents: [
        IrrigationFormDialogComponent
    ]
})
export class IrrigationModule
{
}
