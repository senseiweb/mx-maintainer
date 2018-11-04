import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenieBaseComponent } from './genie-base/genie-base.component';
import { ActionItemsComponent } from './action-item-manager';
import { ListGenyComponent } from './list-geny/list-geny.component';

export const routedComponents = [
    GenieBaseComponent,
    ActionItemsComponent,
    ListGenyComponent
];

const featureRoutes: Routes = [
    {
        path: 'genie',
        component: GenieBaseComponent,
        children: [{
            path: '',
            redirectTo: 'list'
        },
        {
            path: 'list',
            component: ListGenyComponent

        },
        {
            path: 'action-items',
            component: ActionItemsComponent
        }]
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
        RouterModule.forChild(featureRoutes)
    ],
    exports: [
        RouterModule
    ]
})
export class GenieRoutingModule {
    constructor() { }
}
