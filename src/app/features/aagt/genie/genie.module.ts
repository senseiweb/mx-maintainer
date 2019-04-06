import { NgModule } from '@angular/core';
import { AppSharedModule } from 'app/app-shared.module';
import { EditorModule } from 'primeng/editor';
import { ListboxModule } from 'primeng/listbox';
import { PickListModule } from 'primeng/picklist';

import { AagtDataModule } from '../data/aagt-data.module';
import { routedComponents, GenieRoutingModule } from './genie-routing.module';
import { NewTriggerDialogComponent } from './planner';
import { TeamDetailDialogComponent } from './team-manager';

@NgModule({
    imports: [
        AppSharedModule,
        PickListModule,
        ListboxModule,
        EditorModule,
        GenieRoutingModule,
        AagtDataModule
    ],
    providers: [],
    declarations: routedComponents,
    entryComponents: [NewTriggerDialogComponent, TeamDetailDialogComponent]
})
export class GenieModule {}
