import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatToolbarModule } from '@angular/material';

import { FuseSharedModule } from '@fuse/shared.module';

import { FusecFooterComponent } from './fusec-footer.component';

@NgModule({
    declarations: [
        FusecFooterComponent
    ],
    imports     : [
        RouterModule,

        MatButtonModule,
        MatIconModule,
        MatToolbarModule,

        FuseSharedModule
    ],
    exports     : [
        FusecFooterComponent
    ]
})
export class FusecFooterModule {
}
