import { NgxChartsModule } from '@swimlane/ngx-charts';
import { AppSharedModule } from 'app/app-shared.module';
import { NgModule } from '@angular/core';
import { AagtDataModule } from './data/aagt-data.module';
import { AagtRoutingModule, routedComponents } from './aagt-routing.module';

@NgModule({
  imports: [
    NgxChartsModule,
    AagtRoutingModule,
    AagtDataModule,
    AppSharedModule
  ],
  declarations: routedComponents,
  providers: [],
})
export class AagtModule { }
