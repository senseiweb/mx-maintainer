import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from 'app/app-shared.module';
import { GenMgrRoutingMoudle, routedComponents  } from './genie-routing.module';
import { GenieUowService } from './genie-uow.service';
import { ActionManagerUow } from './action-manager-uow.service';
import { NgxDnDModule } from '@swimlane/ngx-dnd';

@NgModule({
  imports: [
    NgxDnDModule,
    CommonModule,
    AppSharedModule,
    GenMgrRoutingMoudle
  ],
  providers: [GenieUowService, ActionManagerUow],
  declarations: routedComponents
})
export class GenieModule {
 }
