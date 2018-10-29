import { NgModule } from '@angular/core';
import { AppSharedModule } from 'app/app-shared.module';
import { UserRoutingModule, routedComponents } from './user-routing.module';


@NgModule({
  declarations: routedComponents,
  imports: [ AppSharedModule, UserRoutingModule ],
  exports: [],
  providers: [],
})
export class UserModule { }
