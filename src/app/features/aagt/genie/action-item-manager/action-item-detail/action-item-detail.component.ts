import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { ActionItem } from 'app/features/aagt/data';
import { TeamCategory } from 'app/features/aagt/data/models/team-category';
import { EntityFormBuilder, EntityFormGroup } from 'app/global-data/';
import { AimUowService } from '../aim-uow.service';

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
    actionItemForm: EntityFormGroup<ActionItem>;
    formBuilder: EntityFormBuilder<ActionItem>;
    formattedDuration: string;
    teamCategories: TeamCategory[];
    private unsubscribeAll: Subject<any>;

    constructor(
        formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private _location: Location,
        private _matSnackBar: MatSnackBar,
        private minExpand: MinutesExpand,
        private aimUow: AimUowService
    ) {
        this.unsubscribeAll = new Subject();
        this.formBuilder = formBuilder as any;
        this.teamCategories = this.aimUow.teamCategories;
    }

    ngOnInit() {
        this.actionItem = this.aimUow.onActionItemChanged.value;
        this.pageType = this.actionItem.entityAspect.entityState.isAdded()
            ? 'new'
            : 'edit';
        this.actionItemForm = this.createActionItemForm() as any;
        this.formatMinutes();

        this.aimUow.onActionItemChanged
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(actionItem => {
                this.pageType = actionItem.entityAspect.entityState.isAdded()
                    ? 'new'
                    : 'edit';
                this.actionItem = actionItem;
                this.actionItemForm = this.createActionItemForm() as any;
                this.formatMinutes();
            });
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    createActionItemForm(): FormBuilder {
        const ai = this.actionItem;
        this.formattedDuration = this.minExpand.transform(ai.duration as any);
        return this.formBuilder.group({
            action: new FormControl(ai.action),
            shortCode: new FormControl(ai.shortCode),
            duration: new FormControl(ai.duration),
            teamCategory: new FormControl(ai.teamCategory),
            assignable: new FormControl(ai.assignable),
            notes: new FormControl(ai.notes)
        }) as any;
    }

    formatMinutes(): void {
        this.actionItemForm
            .get('duration')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
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
        if (this.actionItem.entityAspect.isBeingSaved) {
            return true;
        }
        return itemState.isAddedModifiedOrDeleted();
    }

    saveActionItem(): void {
        Object.keys(this.actionItemForm.controls).forEach(
            (key: keyof bareEntity<ActionItem>) => {
                this.actionItem[key] = this.actionItemForm.get(key).value;
            }
        );
        this.aimUow.saveActionItems(this.actionItem).then(() => {
            this.router.navigate(['../../action-items'], {
                relativeTo: this.route
            });
        });
    }
}
