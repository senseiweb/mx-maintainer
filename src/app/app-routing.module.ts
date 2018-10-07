import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FuseNavigation } from '@fuse/types';
import { AagtAppConfig } from 'app/core';

const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard/status-board',
    pathMatch: 'full'
  },
  {
    path: 'genie',
    loadChildren: './genie/genie.module#GenieModule'
  }
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
  private appNavBarConfig: Array<FuseNavigation> = [{
    id: 'dashboard',
    title: 'Dashboards',
    type: 'group',
    icon: ''
  }, {
    id: 'genie',
    title: 'Geneie',
    type: 'item',
    icon: '',
    url: '/genie'
    }];

  constructor(aagtConfg: AagtAppConfig) {
    this.appNavBarConfig.forEach(navConfig => aagtConfg.fuseNavigation.push(navConfig));

  }

}
