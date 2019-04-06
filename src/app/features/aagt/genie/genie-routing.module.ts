import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    ActionItemsComponent,
    ActionItemDetailComponent
} from './action-item-manager';
import { AimUowService } from './action-item-manager/aim-uow.service';
import { GenieBaseComponent } from './genie-base/genie-base.component';
import { ListGenyComponent } from './list-geny/list-geny.component';
import {
    AssetTriggerSidebarComponent,
    PlannerComponent,
    PlannerUowService,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component
} from './planner';

import { NewTriggerDialogComponent } from './planner/step2/new-trigger/new-trigger-dialog';
import { AssetTriggerActionListComponent } from './planner/step3/asset-trigger-action-list/asset-trigger-action-list.component';
import { TeamDetailDialogComponent } from './team-manager';
import { TeamListComponent } from './team-manager/team-list/team-list.component';
import { TeamUowService } from './team-manager/team-uow.service';

export const routedComponents = [
    GenieBaseComponent,
    ActionItemsComponent,
    ActionItemDetailComponent,
    ListGenyComponent,
    TeamListComponent,
    PlannerComponent,
    Step1Component,
    Step2Component,
    Step3Component,
    Step4Component,
    AssetTriggerSidebarComponent,
    AssetTriggerActionListComponent,
    NewTriggerDialogComponent,
    TeamDetailDialogComponent
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
                resolve: { init: PlannerUowService },
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
                    },
                    {
                        path: 'step4',
                        component: Step4Component
                    }
                ]
            },
            {
                path: 'action-items',
                component: ActionItemsComponent,
                resolve: {
                    actionItems: AimUowService
                }
            },
            {
                path: 'action-items/:id',
                component: ActionItemDetailComponent,
                resolve: {
                    actionItems: AimUowService
                }
            },
            {
                path: 'teams',
                component: TeamListComponent,
                resolve: {
                    teams: TeamUowService
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(featureRoutes)],
    exports: [RouterModule]
})
export class GenieRoutingModule {
    constructor() {}
}
