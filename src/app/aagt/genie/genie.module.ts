import { NgModule } from '@angular/core';
import { AppSharedModule } from 'app/app-shared.module';
import { GenieRoutingModule, routedComponents } from './genie-routing.module';
import { AagtDataModule } from '../data/aagt-data.module';

@NgModule({
    imports: [
        AppSharedModule,
        GenieRoutingModule,
        AagtDataModule
    ],
    providers: [],
    declarations: routedComponents
})
export class GenieModule {
}
