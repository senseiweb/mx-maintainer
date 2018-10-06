import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { FusecNavbarHorizontalStyle1Component } from './fusec-style-1.component';

@NgModule({
    declarations: [
        FusecNavbarHorizontalStyle1Component
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,

        FuseSharedModule,
        FuseNavigationModule
    ],
    exports     : [
        FusecNavbarHorizontalStyle1Component
    ]
})
export class FusecNavbarHorizontalStyle1Module {
}
