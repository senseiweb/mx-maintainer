import { Location } from '@angular/common';
import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subject } from 'rxjs';

import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    startWith,
    takeUntil
} from 'rxjs/operators';

import { ActivatedRoute, Router } from '@angular/router';
import { bareEntity, IDialogResult } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { ActionItem } from 'app/features/aagt/data';
import { TeamCategory } from 'app/features/aagt/data/models/team-category';
import { EntityFormBuilder, EntityFormGroup } from 'app/global-data/';
import { Action } from 'rxjs/internal/scheduler/Action';
import * as sa from 'sweetalert2';
import { AimUowService } from '../aim-uow.service';

type ActionItemModelProps = keyof bareEntity<ActionItem>;
type ActionItemFormModel = { [key in keyof bareEntity<ActionItem>]: any };
type TeamCatFormMode = 'edit' | 'select' | 'add';
@Component({
    selector: 'action-item-detail-dialog',
    templateUrl: './action-item-detail.dialog.html',
    styleUrls: ['./action-item-detail.dialog.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [MinutesExpand]
})
export class ActionItemDetailDialogComponent implements OnInit, OnDestroy {
    constructor(
        private dialogRef: MatDialogRef<ActionItemDetailDialogComponent>,
        private formBuilder: FormBuilder,
        private minExpand: MinutesExpand,
        private aimUow: AimUowService,
        @Inject(MAT_DIALOG_DATA) private currentActionItem: ActionItem
    ) {
        this.unsubscribeAll = new Subject();
        this.teamCategories = this.aimUow.teamCategories;
        this.isSaving = this.aimUow.isSaving;
    }
    formMode: 'edit' | 'add';
    dialogTitle: string;
    isDeleting = false;
    isSaving: Observable<boolean>;
    teamCatFormMode: TeamCatFormMode;
    selectedTeamCat: TeamCategory;
    makeAvail: string;
    newCategoryHint: string;
    actionItemFormGroup: EntityFormGroup<ActionItem>;
    formattedDuration: string;
    teamCategories: TeamCategory[];
    private modelProps: ActionItemModelProps[] = [
        'action',
        'teamCategory',
        'assignable',
        'duration',
        'shortCode',
        'notes'
    ];
    private unsubscribeAll: Subject<any>;

    d;

    ngOnInit() {
        const ai = this.currentActionItem;
        if (ai.entityAspect.entityState.isAdded()) {
            this.formMode = 'add';
            this.dialogTitle = 'Add New Action Item';
        } else {
            this.formMode = 'edit';
            this.dialogTitle = `Edit Action Item ${
                this.currentActionItem.action
            }`;
        }

        this.teamCatFormMode = 'select';

        const formModel: Partial<ActionItemFormModel> = {};
        const aiType = ai.entityType;

        this.modelProps.forEach(prop => {
            formModel[prop] = new FormControl(
                this.currentActionItem[prop],
                aiType.custom.validatorMap[prop]
            );
        });

        formModel['editCategory'] = new FormControl();
        formModel['teamCatColorPicker'] = new FormControl();

        this.actionItemFormGroup = this.formBuilder.group(formModel);

        this.formatMinutes();

        this.actionItemFormGroup
            .get('teamCategory')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe(selectedCat => {
                this.selectedTeamCat = selectedCat;
            });

        this.selectedTeamCat = this.currentActionItem.teamCategory;

        this.formattedDuration = this.minExpand.transform(
            '' + this.currentActionItem.duration
        );
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    addCategory(): void {
        const newTeamCat = this.aimUow.createTeamCategory();
        this.selectedTeamCat = newTeamCat;
        this.editCategory();
    }

    cancel(): void {
        this.currentActionItem.entityAspect.rejectChanges();
        const dialogResult: IDialogResult<ActionItem> = {
            wasConceled: true
        };
        this.dialogRef.close(dialogResult);
    }

    cancelCategory(): void {
        this.selectedTeamCat.entityAspect.rejectChanges();
        this.selectedTeamCat = undefined;
        this.teamCatFormMode = 'select';
    }

    compareCategories(cat1: TeamCategory, cat2: TeamCategory): boolean {
        return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
    }

    async deleteTeamCategory(): Promise<void> {
        const response = await this.deleteItem();
        if (!response) {
            return;
        }
        this.isDeleting = true;
        this.selectedTeamCat.entityAspect.setDeleted();
        // TODO: add error handler
        try {
            const result = await this.aimUow.saveTeamCategory();
        } catch (e) {
        } finally {
            this.isDeleting = false;
        }
        this.teamCategories = this.aimUow.teamCategories;
        this.teamCatFormMode = 'select';
        this.actionItemFormGroup.get('teamCategory').setValue(undefined);
        this.confirmDelete();
    }

    // private async createTeamCat(teamType: string): Promise<TeamCategory> {
    //     const newTeamCat = this.aimUow.createTeamCategory();
    //     newTeamCat.teamType = teamType;
    //     try {
    //         const s = await this.aimUow.saveTeamCategory();
    //         return newTeamCat;
    //     } catch (e) {}
    // }

    async deleteItem(): Promise<any> {
        const config: sa.SweetAlertOptions = {
            title: 'Delete Item?',
            text: `Are you sure?
            To perserve historical records, this may not be possible if this item has been used in a generation. `,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        };
        const result = await sa.default.fire(config);
        return result.value;

        // const atas = _.flatMap(
        //     this.actionItemFormGroup.generationAssets,
        //     x => x.assetTriggerActions
        // );

        // const trigActs = _.flatMap(
        //     this.currentGen.triggers,
        //     x => x.triggerActions
        // );

        // atas.forEach(ata => ata.entityAspect.setDeleted());

        // trigActs.forEach(ta => ta.entityAspect.setDeleted());

        // this.currentGen.triggers.forEach(ta =>
        //     ta.entityAspect.setDeleted()
        // );

        // this.currentGen.generationAssets.forEach(ga =>
        //     ga.entityAspect.setDeleted()
        // );

        // this.currentGen.entityAspect.setDeleted();
        // const saveResult = await this.uow.saveAll();
    }

    async confirmDelete(): Promise<void> {
        await sa.default.fire('Deleted!', 'Item has been deleted', 'success');
    }

    deleteCategory(): void {}

    editCategory(): void {
        this.teamCatFormMode = 'edit';

        const editFormControl = this.actionItemFormGroup.get(
            'editCategory' as any
        );

        const catColorPickerFormControl = this.actionItemFormGroup.get(
            'teamCatColorPicker' as any
        );

        editFormControl.setValue(this.selectedTeamCat.teamType, {
            emitValue: false
        });

        catColorPickerFormControl.valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(color => {
                console.log(color);
                this.selectedTeamCat.teamCatColor = color;
            });

        editFormControl.valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(teamTypeName => {
                this.selectedTeamCat.teamType = teamTypeName;
            });
    }

    // private filterTriggerCats(value: string): TeamCategory[] {
    //     if (typeof value !== 'string' || value === '') {
    //         this.newCategoryHint = undefined;
    //         this.actionItemFormGroup.get('teamCategory').setValue(undefined);
    //         return value as any;
    //     }
    //     const filterValue = value.toLowerCase();
    //     const items = this.teamCategories.filter(tc =>
    //         tc.teamType.toLowerCase().includes(filterValue)
    //     );

    //     if (!items.length && value) {
    //         this.newCategoryHint = `Create category: ${value}`;
    //         this.actionItemFormGroup.get('teamCategory').setValue(0);
    //     } else {
    //         this.newCategoryHint = undefined;
    //         this.actionItemFormGroup.get('teamCategory').setValue(undefined);
    //     }

    //     return items;
    // }

    formatMinutes(): void {
        this.actionItemFormGroup
            .get('duration')
            .valueChanges.pipe(
                filter(val => !isNaN(val)),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(
                val => (this.formattedDuration = this.minExpand.transform(val))
            );
    }

    async saveCategory(): Promise<void> {
        const s = await this.aimUow.saveTeamCategory();
        this.teamCategories = this.aimUow.teamCategories;
        this.actionItemFormGroup
            .get('teamCategory')
            .setValue(this.selectedTeamCat, { emitValue: false });
        this.teamCatFormMode = 'select';
    }

    async saveChanges(del: string): Promise<void> {
        this.modelProps.forEach(prop => {
            const currProp = this.currentActionItem[prop];
            const teamProp = this.actionItemFormGroup.get(prop).value;
            // Only update properties that have changes
            if (currProp !== teamProp) {
                this.currentActionItem[prop] = teamProp;
            }
        });
        try {
            await this.aimUow.saveActionItem();
        } catch (e) {
            await sa.default.fire(
                'U Oh!',
                'There was a problem saving this team, please try again later',
                'error'
            );
            const aiDialogResult: IDialogResult<ActionItem> = {
                confirmChange: true,
                value: this.currentActionItem
            };
            this.dialogRef.close(aiDialogResult);
        }
    }
}
