import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { FuseSharedModule } from '@fuse/shared.module';

import { MainComponent } from './main.component';

const routes = [
    {
        path     : 'main',
        component: MainComponent
    }
];

@NgModule({
    declarations: [
        MainComponent
    ],
    imports     : [
        RouterModule.forChild(routes),

        TranslateModule,

        FuseSharedModule
    ],
    exports     : [
        MainComponent
    ]
})

export class MainModule {
}
