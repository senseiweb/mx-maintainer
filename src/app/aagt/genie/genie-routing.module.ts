import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenieBaseComponent } from './genie-base/genie-base.component';
import { ListGenyComponent } from './list-geny/list-geny.component';
import { PlannerComponent, Step1Component, Step2Component } from './planner';
import { GenieUowService } from './genie-uow.service';
import {
  ActionManagerComponent,
  AmDetailsComponent,
  AmListComponent,
  AmListItemComponent,
  AmSidebarComponent
} from './action-manager';
import { ActionManagerUow } from './action-manager-uow.service';

const routes: Routes = [{
  path: 'genie',
  component: GenieBaseComponent,
  resolve: { genieUow: GenieUowService },
  children: [{
    path: 'list',
    component: ListGenyComponent,
  },
  {
    path: 'planner/:id',
    component: PlannerComponent,
  },
  {
    path: 'action-manager',
    component: ActionManagerComponent,
    resolve: {data: ActionManagerUow},
    children: [{
      path: 'all',
      component: ActionManagerComponent,
    },
    {
      path: 'all/:actionId',
      component: ActionManagerComponent,
    },
    {
      path: 'tag/:tagHandle',
      component: ActionManagerComponent
    },
    {
      path: 'tag/:tagHandle/:actionId',
      component: ActionManagerComponent
    }]
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenMgrRoutingMoudle {}

export const routedComponents = [GenieBaseComponent,
  ListGenyComponent,
  ActionManagerComponent,
  AmListComponent,
  AmDetailsComponent,
  AmListItemComponent,
  AmSidebarComponent,
  PlannerComponent,
  Step1Component,
  Step2Component];
