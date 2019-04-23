import { NgModule } from '@angular/core';
import { AppSharedModule } from 'app/app-shared.module';
import { EditorModule } from 'primeng/editor';
import { ListboxModule } from 'primeng/listbox';
import { PickListModule } from 'primeng/picklist';

import { FuseMaterialColorPickerModule } from '@fuse/components/material-color-picker/material-color-picker.module';
import { AagtDataModule } from '../data/aagt-data.module';
import { ActionItemDetailDialogComponent } from './action-item-manager';
import { routedComponents, GenieRoutingModule } from './genie-routing.module';
import {
    GenerationDetailDialogComponent,
    TriggerDetailDialogComponent
} from './planner';
import { TmAvailDetailDialogComponent } from './planner/step-tm-mgr/team-avail-detail/tm-avail-detail.dialog';
import { TeamDetailDialogComponent } from './team-manager';

@NgModule({
    imports: [
        AppSharedModule,
        PickListModule,
        ListboxModule,
        EditorModule,
        GenieRoutingModule,
        AagtDataModule,
        FuseMaterialColorPickerModule
    ],
    providers: [],
    declarations: routedComponents,
    entryComponents: [
        ActionItemDetailDialogComponent,
        TriggerDetailDialogComponent,
        GenerationDetailDialogComponent,
        TmAvailDetailDialogComponent,
        TeamDetailDialogComponent
    ]
})
export class GenieModule {}
