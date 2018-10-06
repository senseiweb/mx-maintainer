import { NgModule } from '@angular/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { FusecNavbarComponent } from './fusec-navbar.component';
import { FusecNavbarHorizontalStyle1Module } from './horizontal/style-1/fusec-style-1.module';
import { FusecNavbarVerticalStyle1Module } from './vertical/style-1/fusec-style-1.module';
import { FusecNavbarVerticalStyle2Module } from './vertical/style-2/fusec-style-2.module';

@NgModule({
    declarations: [
        FusecNavbarComponent
    ],
    imports     : [
        FuseSharedModule,

        FusecNavbarHorizontalStyle1Module,
        FusecNavbarVerticalStyle1Module,
        FusecNavbarVerticalStyle2Module
    ],
    exports     : [
        FusecNavbarComponent
    ]
})
export class FusecNavbarModule {
}
