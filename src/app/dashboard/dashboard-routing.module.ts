import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { StatusBoardComponent } from './status-board';

const appRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [{
      path: 'status-board',
      component: StatusBoardComponent
    }]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(
      appRoutes    )
  ],
  exports: [
    RouterModule
  ]
})
export class DashboardRoutingModule {

}
