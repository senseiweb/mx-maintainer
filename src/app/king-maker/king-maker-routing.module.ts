import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { KingBaseComponent } from './king-base/king-base.component';
import { ConfigComponent } from './config/config.component';


const routes: Routes = [{
  path: '',
  component: KingBaseComponent,
  children: [{
    path: 'configurations',
    component: ConfigComponent,
  }]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class KingManagerRoutingMoudle {}

export const routedComponents = [KingBaseComponent, ConfigComponent];
