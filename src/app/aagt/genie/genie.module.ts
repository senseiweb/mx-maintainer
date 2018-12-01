import { NgModule } from '@angular/core';
import { AppSharedModule } from 'app/app-shared.module';
import { GenieRoutingModule, routedComponents } from './genie-routing.module';
import { AagtDataModule } from '../data/aagt-data.module';
import {PickListModule} from 'primeng/picklist';
import { NewTriggerDialogComponent } from './planner';

@NgModule({
    imports: [
        AppSharedModule,
        PickListModule,
        GenieRoutingModule,
        AagtDataModule
    ],
    providers: [],
    declarations: routedComponents,
    entryComponents: [NewTriggerDialogComponent]
})
export class GenieModule {
}
