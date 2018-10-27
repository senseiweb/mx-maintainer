import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule, MatIconModule, MatMenuModule, MatToolbarModule } from '@angular/material';

import { FuseSearchBarModule, FuseShortcutsModule } from '@fuse/components';
import { FuseSharedModule } from '@fuse/shared.module';
import { UserService } from 'app/core';
import { FusecToolbarComponent } from './fusec-toolbar.component';

@NgModule({
    declarations: [
        FusecToolbarComponent
    ],
    imports     : [
        RouterModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule,
        MatToolbarModule,

        FuseSharedModule,
        FuseSearchBarModule,
        FuseShortcutsModule
    ],
    exports     : [
        FusecToolbarComponent
    ]
})
export class FusecToolbarModule {
    userName: string;

    constructor(userService: UserService) {
        this.userName = userService.saluation.rankName();
    }
}
