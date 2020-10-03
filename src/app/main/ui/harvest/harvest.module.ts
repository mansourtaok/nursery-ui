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

import { HarvestListComponent } from 'app/main/ui/harvest/harvest-list/harvest-list.component';
import { HarvestSelectedBarComponent } from 'app/main/ui/harvest/selected-bar/selected-bar.component';
import { harvestComponent } from 'app/main/ui/harvest/harvest.component';
import { HarvestService } from './harvest.service';
import { HarvestFormDialogComponent } from './harvest-form/harvest-form.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSelectModule } from '@angular/material/select';



const routes: Routes = [
    {
        path     : 'harvest',
        component: harvestComponent,
        resolve  : {
            harvests: HarvestService
        }
    }
];

@NgModule({
    declarations   : [
        harvestComponent,
        HarvestListComponent,
        HarvestSelectedBarComponent,
        
        HarvestFormDialogComponent
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
        HarvestService
    ],
    entryComponents: [
        HarvestFormDialogComponent
    ]
})
export class HarvestModule
{
}
