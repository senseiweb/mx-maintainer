import { NgModule } from '@angular/core';

import { ActionMngrRoutingModule, routedComponents } from './action-manager-routing.module';

@NgModule({
  imports: [ActionMngrRoutingModule],
  exports: [],
  declarations: [routedComponents],
  providers: [],
})
export class ActionManagerModule { }
