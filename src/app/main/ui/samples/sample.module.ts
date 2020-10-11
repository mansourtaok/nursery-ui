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
import { SampleFormDialogComponent } from './sample-form/sample-form.component';
import { SampleSelectedBarComponent } from './selected-bar/selected-bar.component';
import { SampleListComponent } from './sample-list/sample-list.component';

import { SampleService } from './sample.service';
import { ZoneSampleComponent } from 'app/main/ui/samples/sample.component';



const routes: Routes = [
    {
        path     : 'samples',
        component: ZoneSampleComponent,
        resolve  : {
            samples: SampleService
        }
    }
];

@NgModule({
    declarations   : [
        ZoneSampleComponent,
        SampleListComponent,
        SampleSelectedBarComponent,        
        SampleFormDialogComponent
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
        SampleService
    ],
    entryComponents: [
        SampleFormDialogComponent
    ]
})
export class ZoneSampleModule
{
}
