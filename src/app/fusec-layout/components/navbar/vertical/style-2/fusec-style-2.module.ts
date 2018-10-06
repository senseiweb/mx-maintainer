import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule } from '@angular/material';

import { FuseNavigationModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';

import { FusecNavbarVerticalStyle2Component } from './fusec-style-2.component';

@NgModule({
    declarations: [
        FusecNavbarVerticalStyle2Component
    ],
    imports     : [
        MatButtonModule,
        MatIconModule,

        FuseSharedModule,
        FuseNavigationModule
    ],
    exports     : [
        FusecNavbarVerticalStyle2Component
    ]
})
export class FusecNavbarVerticalStyle2Module {
}
