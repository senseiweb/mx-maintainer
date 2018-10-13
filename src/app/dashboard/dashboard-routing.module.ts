import { NgModule } from '@angular/core';
import { RouterModule, Routes, Route } from '@angular/router';
import { DashBaseComponent } from './dash-base/dash-base.component';
import { StatusBoardComponent } from './status-board';

const routes: Routes = [{
  path: 'dashboard',
  component: DashBaseComponent,
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

  constructor() {
  }
}

export const routedComponents = [StatusBoardComponent];

