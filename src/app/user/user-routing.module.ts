import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashComponent } from './user-dash/user-dash.component';
import { UserBaseComponent } from './user-base/user-base.component';
import { SpDataRepoService } from 'app/data';

const userRoutes: Routes = [
  {
    path: 'user',
    component: UserBaseComponent,
    resolve: [{init: SpDataRepoService}],
    children: [{
      path: 'dashboard',
      component: UserDashComponent
    }]
  }
];
export const routedComponents = [UserBaseComponent, UserDashComponent];

@NgModule({
  imports: [
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class UserRoutingModule {
  constructor() {  }
}