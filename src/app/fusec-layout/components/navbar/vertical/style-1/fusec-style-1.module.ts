import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { FusecNavbarVerticalStyle1Component } from './fusec-style-1.component';

@NgModule({
    declarations: [
        FusecNavbarVerticalStyle1Component
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,

        FuseSharedModule,
        FuseNavigationModule
    ],
    exports     : [
        FusecNavbarVerticalStyle1Component
    ]
})
export class FusecNavbarVerticalStyle1Module {
}
