import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { FuseSharedModule } from '@fuse/shared.module';

import { FusecContentComponent } from './fusec-content.component';

@NgModule({
    declarations: [
        FusecContentComponent
    ],
    imports     : [
        RouterModule,
        FuseSharedModule,
    ],
    exports: [
        FusecContentComponent
    ]
})
export class FusecContentModule {
}
