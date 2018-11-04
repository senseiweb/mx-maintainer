import { NgModule } from '@angular/core';
import { AppSharedModule } from 'app/app-shared.module';
import { GenieUowService } from './genie-uow.service';
import {  GenieRoutingModule, routedComponents } from './genie-routing.module';
import { AimUowService } from './action-item-manager/aim-uow.service';

@NgModule({
    imports: [
        AppSharedModule,
        GenieRoutingModule
    ],
    providers: [GenieUowService, AimUowService],
    declarations: routedComponents
})
export class GenieModule {
}
