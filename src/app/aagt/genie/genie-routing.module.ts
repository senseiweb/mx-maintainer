import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenieBaseComponent } from './genie-base/genie-base.component';
import { ListGenyComponent } from './list-geny/list-geny.component';
import { PlannerComponent, Step1Component, Step2Component } from './planner';
import { GenieUowService } from './genie-uow.service';
import {
  ActionManagerComponent,
  AmListComponent,
  AmDetailsComponent,
  AmSidebarComponent
} from './action-manager';

const routes: Routes = [{
  path: '',
  component: GenieBaseComponent,
  resolve: { done: GenieUowService },
  children: [{
    path: '',
    redirectTo: '/genie/list',
    pathMatch: 'full'
  }, {
    path: 'list',
    component: ListGenyComponent,
  },
  {
    path: 'planner/:id',
    component: PlannerComponent,
  },
  {
    path: 'action-manager',
    component: ActionManagerComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenMgrRoutingMoudle {}

export const routedComponents = [GenieBaseComponent,
  ListGenyComponent,
  PlannerComponent,
  ActionManagerComponent,
  AmListComponent,
  AmDetailsComponent,
  AmSidebarComponent,
  Step1Component,
  Step2Component];
