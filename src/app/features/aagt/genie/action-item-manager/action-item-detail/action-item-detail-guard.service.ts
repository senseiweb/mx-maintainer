import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { CanDeactivate } from '@angular/router';
import { SaveModalDialogComponent } from 'app/common';
import { ActionItemDetailDialogComponent } from './action-item-detail.dialog';

@Injectable()
export class ActionItemDeactiveGuard
    implements CanDeactivate<ActionItemDetailDialogComponent> {
    constructor(private saveDialog: MatDialog) {}

    canDeactivate(component: ActionItemDetailDialogComponent): boolean {
        if (!component) {
            return true;
        }

        const dialog = this.saveDialog.open(SaveModalDialogComponent, {});

        dialog.afterClosed().subscribe(result => {
            return result === 'continue';
        });
    }
}
