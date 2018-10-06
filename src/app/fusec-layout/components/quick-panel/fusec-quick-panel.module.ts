import { NgModule } from '@angular/core';
import { MatDividerModule, MatListModule, MatSlideToggleModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { FusecQuickPanelComponent } from './fusec-quick-panel.component';

@NgModule({
    declarations: [
        FusecQuickPanelComponent
    ],
    imports     : [
        MatDividerModule,
        MatListModule,
        MatSlideToggleModule,

        FuseSharedModule,
    ],
    exports: [
        FusecQuickPanelComponent
    ]
})
export class FusecQuickPanelModule {
}
