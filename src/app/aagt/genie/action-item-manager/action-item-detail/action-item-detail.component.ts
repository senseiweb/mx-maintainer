import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseUtils } from '@fuse/utils';
import { ActionItem } from 'app/aagt/data';
import { AimUowService } from '../aim-uow.service';

@Component({
    selector: 'app-action-item-detail',
    templateUrl: './action-item-detail.component.html',
    styleUrls: ['./action-item-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class ActionItemDetailComponent implements OnInit {
    actionItem: ActionItem;
    pageType: string;
    actionItemForm: FormGroup;
    private unsubscribeAll: Subject<any>;


    constructor(
        private formBuilder: FormBuilder,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private aimUow: AimUowService
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.aimUow.onActionItemChanged
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(actionItem => {
                if (actionItem) {
                    this.pageType = 'edit';
                } else {
                    this.pageType = 'new';
                }
                this.actionItem = actionItem;
                this.actionItemForm = this.createActionItemForm();
            });
    }

    createActionItemForm(): FormGroup {
        const ai = this.actionItem;
        return this.formBuilder.group({
            id: ai.id,
            shortCode: ai.shortCode,
            duration: ai.duration,
            assignedTeamType: ai.assignedTeamType,
            available: ai.availableForUse,
            notes: ai.notes
        });
    }

    saveActionItem(): void {
        return;
    }

}
