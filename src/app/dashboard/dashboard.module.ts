import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { StatusBoardComponent } from './status-board';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { AppSharedModule  } from 'app/app-shared.module';

@NgModule({
  declarations: [
    StatusBoardComponent,
    DashboardComponent
  ],
  imports: [
    NgxChartsModule,
    AppSharedModule,
    DashboardRoutingModule
  ],
  exports: [
  ]
})
export class DashboardModule {

  constructor() {  }
 }
