import { NgModule } from '@angular/core';
import { AppSharedModule } from 'app/app-shared.module';
import { KingManagerRoutingMoudle, routedComponents } from './king-maker-routing.module';

@NgModule({
  imports: [
    AppSharedModule,
    KingManagerRoutingMoudle
  ],
  declarations: [routedComponents]
})
export class KingMakerModule { }
