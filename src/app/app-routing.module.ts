import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppUserService } from './data';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/user/dashboard',
        pathMatch: 'full',
        resolve: {
            appUser: AppUserService
        }
    },
    {
        path: 'aagt',
        loadChildren: './aagt/aagt.module#AagtModule',
        resolve: {
            appUser: AppUserService
        }
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
                useHash: true
                // enableTracing: true
            }
        )
    ],
    exports: [
        RouterModule
    ]
})
export class AppRoutingModule {
    constructor () { }
}
