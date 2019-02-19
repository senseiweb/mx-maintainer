import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { GenieBaseComponent } from './genie-base/genie-base.component';
import {
    ActionItemsComponent,
    ActionItemDetailComponent
} from './action-item-manager';
import { ListGenyComponent } from './list-geny/list-geny.component';
import { AimUowService } from './action-item-manager/aim-uow.service';
import { PlannerComponent, Step1Component, Step2Component, Step3Component, PlannerUowService, GenTriggerSidebarComponent } from './planner';
import { NewTriggerDialogComponent } from './planner/step2/new-trigger/new-trigger-dialog';

export const routedComponents = [
    GenieBaseComponent,
    ActionItemsComponent,
    ActionItemDetailComponent,
    ListGenyComponent,
    PlannerComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    GenTriggerSidebarComponent,
    NewTriggerDialogComponent
];

const featureRoutes: Routes = [
    {
        path: 'genie',
        component: GenieBaseComponent,
        children: [
            {
                path: '',
                redirectTo: 'list'
            },
            {
                path: 'list',
                component: ListGenyComponent
            },
            {
                path: 'planner/:id',
                component: PlannerComponent,
                resolve: {init: PlannerUowService},
                children: [
                    {
                        path: 'step1',
                        component: Step1Component
                    },
                    {
                        path: 'step2',
                        component: Step2Component
                    },
                    {
                        path: 'step3',
                        component: Step3Component
                    }
                ]
            },
            {
                path: 'action-items',
                component: ActionItemsComponent,
                resolve: { actionItems: AimUowService }
            },
            {
                path: 'action-items/:id',
                component: ActionItemDetailComponent,
                resolve: { actionItems: AimUowService }
            }
        ]
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
    imports: [RouterModule.forChild(featureRoutes)],
    exports: [RouterModule]
})
export class GenieRoutingModule {
    constructor() {}
}
