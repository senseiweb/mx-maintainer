import { Injectable } from '@angular/core';
import { ActionItemDetailComponent } from './action-item-detail.component';
import { CanDeactivate } from '@angular/router';
import { SaveModalDialogComponent } from 'app/common';
import { MatDialog } from '@angular/material';


@Injectable()
export class ActionItemDeactiveGuard implements CanDeactivate<ActionItemDetailComponent> {

    constructor(private saveDialog: MatDialog) { }

    canDeactivate(component: ActionItemDetailComponent, ): boolean {
        if (!component.hasUnsavedChanges()) { return true; }

        const dialog = this.saveDialog.open(SaveModalDialogComponent, {

        });

        dialog.afterClosed().subscribe(result => {
            return result === 'continue';
        });
    }
}
