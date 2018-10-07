import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenMgrRoutingMoudle, routedComponents  } from './genie-routing.module';

@NgModule({
  imports: [
    CommonModule,
    GenMgrRoutingMoudle
  ],
  declarations: routedComponents
})
export class GenieModule { }
