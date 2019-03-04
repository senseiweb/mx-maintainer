import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Location } from '@angular/common';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { ActionItem } from 'app/aagt/data';
import { AimUowService } from '../aim-uow.service';
import { MinutesExpand } from 'app/common';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-action-item-detail',
    templateUrl: './action-item-detail.component.html',
    styleUrls: ['./action-item-detail.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [MinutesExpand]
})
export class ActionItemDetailComponent implements OnInit, OnDestroy {
    actionItem: ActionItem;
    makeAvail: string;
    pageType: string;
    actionItemForm: FormGroup;
    actionItemTemplate: any;
    formattedDuration: string;
    teamTypes: string[];
    private unsubscribeAll: Subject<any>;


    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private minExpand: MinutesExpand,
        private aimUow: AimUowService,
    ) {
        this.unsubscribeAll = new Subject();
        this.teamTypes = this.aimUow.teamTypes;
        this.actionItemTemplate = {};
    }

    ngOnInit() {
        this.aimUow.onActionItemChanged
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(actionItem => {
                if (actionItem.entityAspect.entityState.isAdded()) {
                    this.pageType = 'new';
                } else {
                    this.pageType = 'edit';
                }
                console.log(this.pageType);
                this.actionItem = actionItem;
                this.actionItemForm = this.createActionItemForm();
            });
        this.formatMinutes();
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    createActionItemForm(): FormGroup {
        const ai = this.actionItem;
        this.actionItemTemplate['id'] = ai.id;
        this.actionItemTemplate['action'] = ai.action;
        this.actionItemTemplate['shortCode'] = ai.shortCode;
        this.actionItemTemplate['duration'] = ai.duration;
        this.actionItemTemplate['teamType'] = ai.teamType;
        this.actionItemTemplate['availability'] = ai.availability;
        this.actionItemTemplate['notes'] = ai.notes;

        this.formattedDuration = this.minExpand.transform(ai.duration as any);
        return this.formBuilder.group(this.actionItemTemplate);
    }

    formatMinutes(): void {
        this.actionItemForm.get('duration').valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(val => {
                if (isNaN(val)) {
                    return;
                }
                const formatValue = this.minExpand.transform(val);
                this.formattedDuration = formatValue;
            });
    }

    hasUnsavedChanges(): boolean {
        const itemState = this.actionItem.entityAspect.entityState;
        if (this.actionItem.entityAspect.isBeingSaved) { return true; }
        return itemState.isAddedModifiedOrDeleted();
    }


    saveActionItem(): void {
        const aiKeys = Object.keys(this.actionItemTemplate);
        aiKeys.forEach(key => {
            this.actionItem[key] = this.actionItemForm.get(key).value;
        });
        this.aimUow.saveActionItems(this.actionItem)
            .then((ai) => {
                console.log(ai);
                this.router.navigate(['../../action-items'], { relativeTo: this.route });
            });
    }

}
