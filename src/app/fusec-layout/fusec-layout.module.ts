import { NgModule } from '@angular/core';

import { FusecVerticalLayout1Module } from './vertical/layout-1/fusec-layout-1.module';
import { FusecVerticalLayout2Module } from './vertical/layout-2/fusec-layout-2.module';
import { FusecVerticalLayout3Module } from './vertical/layout-3/fusec-layout-3.module';

import { FusecHorizontalLayout1Module } from './horizontal/layout-1/fusec-layout-1.module';

@NgModule({
    imports: [
        FusecVerticalLayout1Module,
        FusecVerticalLayout2Module,
        FusecVerticalLayout3Module,
        FusecHorizontalLayout1Module
    ],
    exports: [
        FusecVerticalLayout1Module,
        FusecVerticalLayout2Module,
        FusecVerticalLayout3Module,
        FusecHorizontalLayout1Module
    ]
})
export class FusecLayoutModule {
}
