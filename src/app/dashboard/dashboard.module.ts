import { NgModule } from '@angular/core';
import { DashboardComponent } from './dashboard.component';
import { StatusBoardComponent } from './status-board';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { DashboardRoutingModule } from './dashboard-routing.module';

import {
  FuseSharedModule,
  FuseSidebarModule,
  FuseWidgetModule
} from '@fuse';
import { CoreModule } from '../core';

@NgModule({
  declarations: [
    StatusBoardComponent,
    DashboardComponent
  ],
  imports: [
    CoreModule,
    NgxChartsModule,
    DashboardRoutingModule
  ],
  exports: [
    StatusBoardComponent,
    DashboardComponent
  ]
})
export class DashboardModule {

  constructor() {  }
 }
