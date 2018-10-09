import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenieComponent } from './genie.component';
import { ListGenyComponent } from './list-geny/list-geny.component';
import { PlannerComponent } from './planner/planner.component';

const routes: Routes = [{
  path: '',
  component: GenieComponent,
  children: [{
    path: '',
    component: ListGenyComponent,
  }, {
    path: 'planner',
    component: PlannerComponent
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GenMgrRoutingMoudle {}

export const routedComponents = [GenieComponent, ListGenyComponent, PlannerComponent];
