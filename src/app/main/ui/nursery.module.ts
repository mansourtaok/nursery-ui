import { NgModule } from '@angular/core';

import { UIFormsModule } from 'app/main/ui/forms/forms.module';
import { ContactsModule } from './contacts/contacts.module';


@NgModule({
    imports: [
        UIFormsModule,
        ContactsModule
    ]
})
export class NureryModule
{
    
}
