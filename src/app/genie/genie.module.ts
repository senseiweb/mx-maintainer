import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppSharedModule } from 'app/app-shared.module';
import { GenMgrRoutingMoudle, routedComponents  } from './genie-routing.module';
import { GenieUowService } from './genie-uow.service';
import { TaskManagerModule } from './task-manager/';

@NgModule({
  imports: [
    CommonModule,
    AppSharedModule,
    GenMgrRoutingMoudle,
    TaskManagerModule
  ],
  providers: [GenieUowService],
  declarations: routedComponents
})
export class GenieModule {
 }
