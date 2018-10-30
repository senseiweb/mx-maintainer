import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AagtDashboardComponent } from './dashboard/aagt-dash.component';

const aagtRoutes: Routes = [
  {
    path: '',
    redirectTo: '/aagt/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: AagtDashboardComponent
  }
];
export const routedComponents = [AagtDashboardComponent];

@NgModule({
  imports: [
    RouterModule.forChild(aagtRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class AagtRoutingModule {
  constructor() {  }
}
