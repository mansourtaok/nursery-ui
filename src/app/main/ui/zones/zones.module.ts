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

import { ZoneComponent } from 'app/main/ui/zones/zones.component';
import { ZoneService } from 'app/main/ui/zones/zones.service';
import { ZoneListComponent } from 'app/main/ui/zones/zone-list/zone-list.component';
import { ZoneSelectedBarComponent } from 'app/main/ui/zones/selected-bar/selected-bar.component';
import { ZoneFormDialogComponent } from 'app/main/ui/zones/zone-form/zone-form.component';
import { MatSelectModule } from '@angular/material/select';


const routes: Routes = [
    {
        path     : 'zones',
        component: ZoneComponent,
        resolve  : {
            zones: ZoneService
        }
    }
];

@NgModule({
    declarations   : [
        ZoneComponent,
        ZoneListComponent,
        ZoneSelectedBarComponent,        
        ZoneFormDialogComponent
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
        ZoneService
    ],
    entryComponents: [
        ZoneFormDialogComponent
    ]
})
export class ZoneModule
{
}
