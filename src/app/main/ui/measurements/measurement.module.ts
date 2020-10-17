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
import { MeasurementFormDialogComponent } from './measurement-form/measurement-form.component';
import { MeasurementService } from './measurement.service';
import { MeasurementComponent } from './measurement.component';
import { MeasurementListComponent } from './measurement-list/measurement-list.component';
import { MeasurementSelectedBarComponent } from './measurement-bar/selected-bar.component';

const routes: Routes = [
    {
        path     : 'measurements',
        component: MeasurementComponent,
        resolve  : {
            measurements: MeasurementService
        }
    }
];

@NgModule({
    declarations   : [
        MeasurementComponent,
        MeasurementListComponent,
        MeasurementSelectedBarComponent,        
        MeasurementFormDialogComponent
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
        MeasurementService
    ],
    entryComponents: [
        MeasurementFormDialogComponent
    ]
})
export class MeasurementModule
{
}
