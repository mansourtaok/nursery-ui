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
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';
import { SeedingFormDialogComponent } from './seeding-form/seeding-form.component';
import { SeedingService } from './seeding.service';
import { SeedingComponent } from './seeding.component';
import { SeedingListComponent } from './seeding-list/seeding-list.component';
import { SeedingSelectedBarComponent } from './selected-bar/selected-bar.component';
import { DatePipe } from '@angular/common';



const routes: Routes = [
    {
        path     : 'seeding',
        component: SeedingComponent,
        resolve  : {
            seedingList: SeedingService
        }
    }
];

@NgModule({
    declarations   : [
        SeedingComponent,
        SeedingListComponent,
        SeedingSelectedBarComponent,
        
        SeedingFormDialogComponent
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
        FuseSidebarModule,
        MatStepperModule,
    ],
    providers      : [
        SeedingService,
        DatePipe
    ],
    entryComponents: [
        SeedingFormDialogComponent
    ]
})
export class SeedingModule
{
}
