import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSidebarModule } from '@fuse/components/index';
import { FuseSharedModule } from '@fuse/shared.module';

import { FusecContentModule } from '../../components/content/fusec-content.module';
import { FusecFooterModule } from '../../components/footer/fusec-footer.module';
import { FusecNavbarModule } from '../../components/navbar/fusec-navbar.module';
import { FusecQuickPanelModule } from '../../components/quick-panel/fusec-quick-panel.module';
import { FusecToolbarModule } from '../../components/toolbar/fusec-toolbar.module';

import { FusecVerticalLayout3Component } from './fusec-layout-3.component';

@NgModule({
    declarations: [
        FusecVerticalLayout3Component
    ],
    imports     : [
        RouterModule,

        FuseSharedModule,
        FuseSidebarModule,

        FusecContentModule,
        FusecFooterModule,
        FusecNavbarModule,
        FusecQuickPanelModule,
        FusecToolbarModule
    ],
    exports     : [
        FusecVerticalLayout3Component
    ]
})
export class FusecVerticalLayout3Module {
}
