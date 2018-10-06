import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StatusBoardComponent } from './status-board';
import { AagtAppConfig } from 'app/core';
import { FuseNavigation } from '@fuse/types';

const dashboardRoutes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  children: [{
    path: 'status-board',
    component: StatusBoardComponent
  }]
}];


@NgModule({
  imports: [
    RouterModule.forChild(dashboardRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule {

  dashboardNavConfig: Array<FuseNavigation> = [{
    id: 'dashboard',
    title: 'Dashboards',
    type: 'group',
    children: [{
      id: 'dash-status-board',
      title: 'Status Boards',
      type: 'item',
      icon: 'charts'
    }]
  }];

  constructor(_aagtConfg: AagtAppConfig) {
    this.dashboardNavConfig.forEach(navConfig => _aagtConfg.fuseNavigation.push(navConfig));
  }
}
