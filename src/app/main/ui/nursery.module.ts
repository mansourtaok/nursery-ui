import { NgModule } from '@angular/core';

import { UIFormsModule } from 'app/main/ui/forms/forms.module';

import { HarvestModule } from './harvest/harvest.module';
import { SeedingModule } from './seeding/seeding.module';
import { SpeciesModule } from './species/species.module';
import { StocksModule } from './stocks/stocks.module';
import { ZoneModule } from './zones/zones.module';
import { ZoneSampleModule } from './samples/sample.module';


@NgModule({
    imports: [
        ZoneModule,
        UIFormsModule,        
        StocksModule,
        SpeciesModule,
        HarvestModule,
        SeedingModule,
        ZoneSampleModule
    ]
})
export class NureryModule
{
    
}
