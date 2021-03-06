import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
    ActionItemsComponent,
    ActionItemDetailDialogComponent
} from './action-item-manager';
import { AimUowService } from './action-item-manager/aim-uow.service';
import {
    ActionItemSidebarComponent,
    GenerationDetailDialogComponent,
    PlannerComponent,
    PlannerUowService,
    StepAtaListComponent,
    StepGenAssetComponent,
    StepSummaryComponent,
    StepTrigActionComponent,
    TriggerDetailDialogComponent
} from './planner';

import { AssetSidebarComponent } from './planner/step-ata-list/asset-sidebar/asset-sidebar.component';
import { AtaDetailDialogComponent } from './planner/step-ata-list/ata-detail/ata-detail.dialog';
import { StepTeamManagerComponent } from './planner/step-tm-mgr/step-tm-mgr-component';
import { TmAvailDetailDialogComponent } from './planner/step-tm-mgr/team-avail-detail/tm-avail-detail.dialog';
import { TeamDetailDialogComponent } from './team-manager';
import { TeamListComponent } from './team-manager/team-list/team-list.component';
import { TeamUowService } from './team-manager/team-uow.service';

export const routedComponents = [
    ActionItemsComponent,
    ActionItemDetailDialogComponent,
    AtaDetailDialogComponent,
    AssetSidebarComponent,
    ActionItemSidebarComponent,
    TmAvailDetailDialogComponent,
    TeamListComponent,
    PlannerComponent,
    StepGenAssetComponent,
    StepTrigActionComponent,
    StepAtaListComponent,
    StepSummaryComponent,
    TriggerDetailDialogComponent,
    TeamDetailDialogComponent,
    StepTeamManagerComponent,
    GenerationDetailDialogComponent
];

const featureRoutes: Routes = [
    {
        path: 'genie',
        children: [
            {
                path: 'planner/:id',
                component: PlannerComponent,
                resolve: { init: PlannerUowService },
                children: [
                    {
                        path: 'step-gen-assets',
                        component: StepGenAssetComponent
                    },
                    {
                        path: 'step-trigger-actions',
                        component: StepTrigActionComponent
                    },
                    {
                        path: 'step-team-availability',
                        component: StepTeamManagerComponent
                    },
                    {
                        path: 'step-asset-trigger-actions',
                        component: StepAtaListComponent
                    },
                    {
                        path: 'step-summary',
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
                component: ActionItemDetailDialogComponent,
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
