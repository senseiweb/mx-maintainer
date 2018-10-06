import { NgModule } from '@angular/core';
import { MatSidenavModule } from '@angular/material';

import { FuseSidebarModule, FuseThemeOptionsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { FusecContentModule } from '../../components/content/fusec-content.module';
import { FusecFooterModule } from '../../components/footer/fusec-footer.module';
import { FusecNavbarModule } from '../../components/navbar/fusec-navbar.module';
import { FusecQuickPanelModule } from '../../components/quick-panel/fusec-quick-panel.module';
import { FusecToolbarModule } from '../../components/toolbar/fusec-toolbar.module';

import { FusecHorizontalLayout1Component } from './fusec-layout-1.component';

@NgModule({
    declarations: [
        FusecHorizontalLayout1Component
    ],
    imports     : [
        MatSidenavModule,

        FuseSharedModule,
        FuseSidebarModule,
        FuseThemeOptionsModule,

        FusecContentModule,
        FusecFooterModule,
        FusecNavbarModule,
        FusecQuickPanelModule,
        FusecToolbarModule
    ],
    exports     : [
        FusecHorizontalLayout1Component
    ]
})
export class FusecHorizontalLayout1Module {
}
