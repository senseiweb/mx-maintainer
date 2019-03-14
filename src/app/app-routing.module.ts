import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: '/user/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'aagt',
        loadChildren: './features/aagt/aagt.module#AagtModule'
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
        RouterModule.forRoot(appRoutes, {
            useHash: true
            // enableTracing: true
        })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
    constructor() {}
}
