import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import 'hammerjs';

import { FuseModule } from '@fuse/fuse.module';
import { FuseSharedModule } from '@fuse/shared.module';
import { FuseProgressBarModule, FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';

import { fuseConfig } from 'app/fuse-config';

import { AppComponent } from 'app/app.component';
import { LayoutModule } from 'app/layout/layout.module';
import { SampleModule } from 'app/main/sample/sample.module';
import { LoginModule } from './main/auth/login/login.module';
import { AuthenticationGuardService } from './main/auth/authentication-guard.service';


const appRoutes: Routes = [
    
    {
        path        : 'nursery', 
        pathMatch: 'prefix' ,
        redirectTo: 'auth/login'
    },
    {
        path        : '', 
        pathMatch: 'full' ,
        redirectTo: 'auth/login'
    },
    {
        path        : 'ui',
        canActivate: [AuthenticationGuardService],
        loadChildren: () => import('./main/ui/nursery.module').then(m => m.NureryModule)
    },

];

@NgModule({
    declarations: [
        AppComponent
    ],
    imports     : [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes),

        TranslateModule.forRoot(),

        // Material moment date module
        MatMomentDateModule,

        // Material
        MatButtonModule,
        MatIconModule,
        

        // Fuse modules
        FuseModule.forRoot(fuseConfig),
        FuseProgressBarModule,
        FuseSharedModule,
        FuseSidebarModule,
        //FuseThemeOptionsModule,

        // App modules
        LayoutModule,
        SampleModule,
        LoginModule
    ],
    bootstrap   : [
        AppComponent
    ],
    providers :[
        AuthenticationGuardService
    ]
})
export class AppModule
{
}
