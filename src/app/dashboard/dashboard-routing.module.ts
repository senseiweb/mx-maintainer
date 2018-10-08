import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StatusBoardComponent } from './status-board';
import { AagtAppConfig } from 'app/core';
import { FuseNavigation } from '@fuse/types';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

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
    id: 'dash-status-board',
    title: 'Status Boards',
    type: 'item'
  }];

  constructor(navService: FuseNavigationService, _aagtConfig: AagtAppConfig) {
    this.dashboardNavConfig.forEach(navItem => navService.addNavigationItem(navItem, 'dashboard'));
  }
}

export const routedComponents = [StatusBoardComponent];
