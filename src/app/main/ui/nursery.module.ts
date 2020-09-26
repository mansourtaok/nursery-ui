import { NgModule } from '@angular/core';

import { UIFormsModule } from 'app/main/ui/forms/forms.module';
import { StocksModule } from './stocks/stocks.module';
import { ZoneModule } from './zones/zones.module';


@NgModule({
    imports: [
        ZoneModule,
        UIFormsModule,        
        StocksModule
    ]
})
export class NureryModule
{
    
}
