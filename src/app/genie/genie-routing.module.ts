import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenieBaseComponent } from './genie-base/genie-base.component';
import { ListGenyComponent } from './list-geny/list-geny.component';
import { PlannerComponent, Step1Component, Step2Component } from './planner';
import { GenieUowService } from './genie-uow.service';
import {
  TaskManagerComponent,
  TmListComponent,
  TmDetailsComponent,
  TmSidebarComponent
} from './task-manager';

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
    path: 'task-manager',
    component: TaskManagerComponent
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
  TaskManagerComponent,
  TmListComponent,
  TmDetailsComponent,
  TmSidebarComponent,
  Step1Component,
  Step2Component];
