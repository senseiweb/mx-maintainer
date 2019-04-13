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
    AssetTriggerActionListComponent,
    AssetTriggerSidebarComponent,
    NewGenerationDialogComponent,
    PlannerComponent,
    PlannerUowService,
    StepAtaListComponent,
    StepGenAssetComponent,
    StepSummaryComponent,
    StepTrigActionComponent
} from './planner';

import { NewTriggerDialogComponent } from './planner/step-trig-action/new-trigger/new-trigger-dialog';
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
    StepGenAssetComponent,
    StepTrigActionComponent,
    StepAtaListComponent,
    StepSummaryComponent,
    AssetTriggerSidebarComponent,
    AssetTriggerActionListComponent,
    NewTriggerDialogComponent,
    TeamDetailDialogComponent,
    NewGenerationDialogComponent
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
                        component: StepGenAssetComponent
                    },
                    {
                        path: 'step2',
                        component: StepTrigActionComponent
                    },
                    {
                        path: 'step3',
                        component: StepAtaListComponent
                    },
                    {
                        path: 'step4',
                        component: StepSummaryComponent
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
