import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StatusBoardComponent } from './status-board';
import { AagtAppConfig } from 'app/core';
import { FuseNavigation } from '@fuse/types';

const routes: Routes = [{
  path: 'dashboard',
  component: DashboardComponent,
  children: [{
    path: 'status-board',
    component: StatusBoardComponent
  }]
}];


@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule {

  private dashboardNavConfig: Array<FuseNavigation> = [{
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

  constructor(aagtConfg: AagtAppConfig) {
    this.dashboardNavConfig.forEach(navConfig => aagtConfg.fuseNavigation.push(navConfig));
  }
}

export const routedComponents = [StatusBoardComponent];
