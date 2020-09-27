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

import { SpeciesComponent } from 'app/main/ui/species/species.component';
import { MatSelectModule } from '@angular/material/select';
import { SpeciesFormDialogComponent } from './species-form/species-form.component';

import { SpeciesService } from './species.service';
import { SpeciesListComponent } from './species-list/species-list.component';
import { SpeciesSelectedBarComponent } from './selected-bar/selected-bar.component';


const routes: Routes = [
    {
        path     : 'species',
        component: SpeciesComponent,
        resolve  : {
            species: SpeciesService
        }
    }
];

@NgModule({
    declarations   : [
        SpeciesComponent,
        SpeciesListComponent,
        SpeciesSelectedBarComponent,        
        SpeciesFormDialogComponent
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
        SpeciesService
    ],
    entryComponents: [
        SpeciesFormDialogComponent
    ]
})
export class SpeciesModule
{
}
