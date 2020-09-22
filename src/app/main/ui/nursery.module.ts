import { NgModule } from '@angular/core';

import { UIFormsModule } from 'app/main/ui/forms/forms.module';
import { StocksModule } from './stocks/stocks.module';


@NgModule({
    imports: [
        UIFormsModule,
        StocksModule
    ]
})
export class NureryModule
{
    
}
