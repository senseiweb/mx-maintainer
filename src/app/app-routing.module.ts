import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

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
  constructor() {  }

}
