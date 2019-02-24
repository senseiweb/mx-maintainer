import { NgModule } from '@angular/core';
import { SaveModalDialogComponent } from './save-modal/save-modal.component';
import { PipesModule } from './pipes';
import { MatToolbarModule, MatDialogModule } from '@angular/material';
import { ConfirmDeleteModalComponent } from './confirm-delete-modal/confirm-delete-modal.component';
import { CanDeactivate } from '@angular/router/src/utils/preactivation';

@NgModule({
    declarations: [
        SaveModalDialogComponent,
        ConfirmDeleteModalComponent
    ],
    imports: [
       PipesModule,
       MatToolbarModule,
        MatDialogModule,
       CanDeactivate
    ],
    exports: [PipesModule],
    entryComponents: [ConfirmDeleteModalComponent, SaveModalDialogComponent],
    providers: [],
})
export class MxCommonModule { }
