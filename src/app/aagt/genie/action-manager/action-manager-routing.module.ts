import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ActionManagerComponent } from './base/action-manager.component';
import { AmDetailsComponent } from './details/am-details.component';
import { AmListComponent } from './list/am-list.component';
import { AmSidebarComponent } from './sidebar/am-sidebar.component';

const routes: Routes = [{
  path: 'all',
  component: ActionManagerComponent,
},
{
  path: 'all/:taskId',
  component: ActionManagerComponent,
},
{
  path: 'tag/:tagHandle',
  component: ActionManagerComponent
},
{
  path: 'tag/:tagHandle/:todoId',
  component: ActionManagerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ActionMngrRoutingModule {}

export const routedComponents = [
  ActionManagerComponent,
  AmListComponent,
  AmDetailsComponent,
  AmSidebarComponent,
];
