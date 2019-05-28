import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AagtDashboardComponent } from './dashboard/aagt-dash.component';
import { GenListDataSource } from './gen-manager/gen-list/gen-list.datasource';
import { GenMgrUowService } from './gen-manager/gen-mgr-uow.service';
import { GenListComponent, GenListDetailComponent } from './genie';

const aagtRoutes: Routes = [
    {
        path: '',
        redirectTo: '/aagt/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'dashboard',
        component: AagtDashboardComponent
    },
    {
        path: 'gen-control',
        children: [
            {
                path: '',
                redirectTo: 'gen-list'
            },
            {
                path: 'gen-list',
                component: GenListComponent,
                resolve: { initGens: GenMgrUowService }
            },
            {
                path: 'gen-detail/:id',
                component: GenListDetailComponent,
                resolve: { initGenDetails: GenMgrUowService }
            }
        ]
    }
];
export const routedComponents = [
    AagtDashboardComponent,
    GenListComponent,
    GenListDetailComponent
];

@NgModule({
    imports: [RouterModule.forChild(aagtRoutes)],
    exports: [RouterModule]
})
export class AagtRoutingModule {
    constructor() {}
}
