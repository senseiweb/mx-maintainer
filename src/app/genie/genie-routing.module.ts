import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenieBaseComponent } from './genie-base/genie-base.component';
import { ListGenyComponent } from './list-geny/list-geny.component';
import { PlannerComponent } from './planner/planner.component';
import { GenieUowService } from './genie-uow.service';

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
    resolve: { done: GenieUowService }
  },
  {
    path: 'planner/:id',
    component: PlannerComponent,
    resolve: { done: GenieUowService }
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenMgrRoutingMoudle {}

export const routedComponents = [GenieBaseComponent, ListGenyComponent, PlannerComponent];
