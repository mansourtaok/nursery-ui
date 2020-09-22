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

import { StocksComponent } from 'app/main/ui/stocks/stocks.component';
import { StocksService } from 'app/main/ui/stocks/stocks.service';
import { StocksListComponent } from 'app/main/ui/stocks/stock-list/stock-list.component';
import { ContactsSelectedBarComponent } from 'app/main/ui/stocks/selected-bar/selected-bar.component';
import { ContactsMainSidebarComponent } from 'app/main/ui/stocks/sidebars/main/main.component';
import { StocksFormDialogComponent } from 'app/main/ui/stocks/stock-form/stock-form.component';

const routes: Routes = [
    {
        path     : '**',
        component: StocksComponent,
        resolve  : {
            contacts: StocksService
        }
    }
];

@NgModule({
    declarations   : [
        StocksComponent,
        StocksListComponent,
        ContactsSelectedBarComponent,
        ContactsMainSidebarComponent,
        StocksFormDialogComponent
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

        FuseSharedModule,
        FuseConfirmDialogModule,
        FuseSidebarModule
    ],
    providers      : [
        StocksService
    ],
    entryComponents: [
        StocksFormDialogComponent
    ]
})
export class StocksModule
{
}
