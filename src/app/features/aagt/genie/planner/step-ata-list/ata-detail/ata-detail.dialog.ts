import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { MatDialogRef, MatSnackBar, MAT_DIALOG_DATA } from '@angular/material';
import { Observable, Subject } from 'rxjs';

import { filter, takeUntil } from 'rxjs/operators';

import { DatePipe } from '@angular/common';
import { SpFormModel, SpFormProps } from '@ctypes/app-config';
import { IDialogResult } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { ActionItem, AssetTriggerAction } from 'app/features/aagt/data';
import { TeamCategory } from 'app/features/aagt/data/models/team-category';
import { EntityFormGroup } from 'app/global-data/';
import * as _l from 'lodash';
import * as sa from 'sweetalert2';

type ThisFormProp = Array<SpFormProps<AssetTriggerAction> | 'teamCategory'>;
type ThisFormModel = SpFormModel<ThisFormProp>;

@Component({
    templateUrl: './ata-detail.dialog.html',
    styleUrls: ['./ata-detail.dialog.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations,
    providers: [MinutesExpand]
})
export class AtaDetailDialogComponent implements OnInit, OnDestroy {
    constructor(
        private dialogRef: MatDialogRef<AtaDetailDialogComponent>,
        private fb: FormBuilder,
        private minExpand: MinutesExpand,
        @Inject(MAT_DIALOG_DATA) private selectedAta: AssetTriggerAction
    ) {
        this.unsubscribeAll = new Subject();
    }
    ataFormGroup: FormGroup;
    assignedToTeamNames: string[] = [];
    dialogTitle: string;
    isDeleting = false;
    isSaving: Observable<boolean>;
    makeAvail: string;
    newCategoryHint: string;
    actionItemFormGroup: EntityFormGroup<ActionItem>;
    formattedDuration: string;
    teamCategories: TeamCategory[];
    private modelProps: ThisFormProp = [
        'plannedStart',
        'teamCategory',
        'actionStatus',
        'outcome',
        'plannedStop',
        'scheduledStart',
        'scheduledStop',
        'actualStart',
        'actualStop'
    ];
    private unsubscribeAll: Subject<any>;

    ngOnInit() {
        this.dialogTitle = `Details: ${
            this.selectedAta.triggerAction.actionItem.action
        } on Asset: ${this.selectedAta.generationAsset.asset.alias}`;
        this.assignedToTeamNames = [
            ...new Set(
                _l.flatMap(
                    this.selectedAta.teamJobReservations,
                    x => x.teamAvailability.team.teamName
                )
            )
        ];
        this.createFormAndValidators();
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    acceptChanges(): void {}

    private createFormAndValidators(): void {
        const formModel: ThisFormModel = {};
        const datePipe = new DatePipe('en-US');
        const entityType = this.selectedAta.entityType;
        const formValidators =
            entityType.custom && entityType.custom.formValidators;

        for (const prop of this.modelProps) {
            if (prop === 'teamCategory') {
                formModel[prop] = new FormControl(
                    this.selectedAta.triggerAction.actionItem.teamCategory.teamType
                );
                continue;
            }
            if (prop === 'plannedStart' || prop === 'plannedStop') {
                const ataDate = this.selectedAta[prop];

                formModel[prop] = new FormControl(
                    ataDate
                        ? datePipe.transform(ataDate, 'dd-MMM HHmm')
                        : ataDate
                );
                formModel[prop].disable();
                continue;
            }

            formModel[prop] = new FormControl(
                this.selectedAta[prop],
                formValidators && formValidators.propVal.get(prop)
            );
        }

        this.ataFormGroup = this.fb.group(formModel);
    }

    cancel(): void {
        // this.selectedAta.entityAspect.rejectChanges();
        const dialogResult: IDialogResult<ActionItem> = {
            wasConceled: true
        };
        this.dialogRef.close(dialogResult);
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
        // TODO: add error handler
        try {
        } catch (e) {
        } finally {
            this.isDeleting = false;
        }
        this.confirmDelete();
    }

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
    }

    async confirmDelete(): Promise<void> {
        await sa.default.fire('Deleted!', 'Item has been deleted', 'success');
    }

    deleteCategory(): void {}

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

    async saveCategory(): Promise<void> {}

    async saveChanges(del: string): Promise<void> {}
}
