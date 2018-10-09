import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
  constructor(_aagtAppConfig: AagtAppConfig) {  }

}
