import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SpDataRepoService } from './data';
import { UserBaseComponent } from './user/user-base/user-base.component';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/user/dashboard/',
    pathMatch: 'full',
    resolve: [{initializer: SpDataRepoService}]
  },
  {
    path: 'aagt',
    loadChildren: './aagt/aagt.module#AagtModule'
  }
  // {
  //   path: 'program-manager',
  //   loadChildren: './program-manager/prog-mgr.module#ProgMgrModule'
  // }, {
  //   path: 'mocc',
  //   loadChildren: './mocc/mocc.module#MoccModule'
  // }
  // { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        useHash: true,
        // enableTracing: true
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  constructor() {  }

}
