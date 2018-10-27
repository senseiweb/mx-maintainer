import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TaskManagerComponent } from './base/task-manager.component';
import { TmDetailsComponent } from './details/tm-details.component';
import { TmListComponent } from './list/tm-list.component';
import { TmSidebarComponent } from './sidebar/tm-sidebar.component';

const routes: Routes = [{
  path: 'all',
  component: TaskManagerComponent,
},
{
  path: 'all/:taskId',
  component: TaskManagerComponent,
},
{
  path: 'tag/:tagHandle',
  component: TaskManagerComponent
},
{
  path: 'tag/:tagHandle/:todoId',
  component: TaskManagerComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskMngrRoutingModule {}

export const routedComponents = [
  TaskManagerComponent,
  TmListComponent,
  TmDetailsComponent,
  TmSidebarComponent,
];
