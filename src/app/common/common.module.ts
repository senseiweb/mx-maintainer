import { NgModule } from '@angular/core';
import { SaveModalDialogComponent } from './save-modal/save-modal.component';
import { PipesModule } from './pipes';
import { MatToolbarModule, MatDialogModule } from '@angular/material';

@NgModule({
    declarations: [SaveModalDialogComponent],
    imports: [
       PipesModule,
       MatToolbarModule,
       MatDialogModule,
    ],
    exports: [PipesModule],
    providers: [],
})
export class MxCommonModule { }
