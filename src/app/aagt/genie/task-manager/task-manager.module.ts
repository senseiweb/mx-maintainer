import { NgModule } from '@angular/core';

import { TaskMngrRoutingModule, routedComponents } from './task-manager-routing.module';

@NgModule({
  imports: [TaskMngrRoutingModule],
  exports: [],
  declarations: [routedComponents],
  providers: [],
})
export class TaskManagerModule { }
