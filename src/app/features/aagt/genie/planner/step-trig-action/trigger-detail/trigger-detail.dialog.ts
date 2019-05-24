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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {
    IDialogResult,
    Omit,
    RawEntity
} from '@ctypes/breeze-type-customization';
import { Trigger } from 'app/features/aagt/data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as sa from 'sweetalert2';
import { PlannerUowService } from '../../planner-uow.service';

type TriggerModelProps =
    | keyof Omit<RawEntity<Trigger>, 'completionTime'>
    | 'triggerStartTime';
type TriggerFormModel = { [key in TriggerModelProps]: any };

@Component({
    selector: 'trigger-detail-dialog',
    templateUrl: './trigger-detail.dialog.html',
    styleUrls: ['./trigger-detail.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TriggerDetailDialogComponent implements OnInit, OnDestroy {
    triggerFormGroup: FormGroup;
    generationStart: _m.Moment;
    invalidStartDate: _m.Moment;
    isNew = false;
    isValid = false;
    dialogTitle: string;
    private modelProps: TriggerModelProps[] = [
        'milestone',
        'triggerStart',
        'triggerStartTime'
    ];
    private unsubscribeAll: Subject<any>;

    markGenerationDate = (d: _m.Moment): string | undefined => {
        return d.isSame(this.generationStart, 'd')
            ? 'generation-start-marker'
            : undefined;
    }

    constructor(
        private dialogRef: MatDialogRef<TriggerDetailDialogComponent>,
        private formBuilder: FormBuilder,
        planUow: PlannerUowService,
        @Inject(MAT_DIALOG_DATA) private currentTrigger: Trigger
    ) {
        /**
         * Set one day before generation start as invalid dates
         * due to the fact that a trigger cannot happen before
         * the generation start.
         */
        this.generationStart = _m(planUow.currentGen.genStartDate);
        this.invalidStartDate = _m(this.generationStart).subtract(1, 'd');
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        /** if no time is set...set default time to the next half hour */
        if (!this.currentTrigger.triggerStart) {
            const start = _m();
            const remainder = 30 - (start.minute() % 30);
            const defaultStart = start.add(remainder, 'minute');

            this.currentTrigger.triggerStart = defaultStart.toDate();
        }

        this.dialogTitle = this.currentTrigger.entityAspect.entityState.isAdded()
            ? 'Create Trigger'
            : `Edit ${this.currentTrigger.milestone} Trigger`;

        this.createFormsAndValidators();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    acceptChanges(): void {
        this.modelProps.forEach(prop => {
            const formValue = this.triggerFormGroup.get(prop).value;
            const currProp = this.currentTrigger[prop];

            if (prop === 'triggerStart' && formValue) {
                this.currentTrigger.triggerStart = (formValue as _m.Moment).toDate();
            } else if (currProp !== formValue) {
                this.currentTrigger[prop as any] = formValue;
            }
        });

        const timeValue: string = this.triggerFormGroup.get('triggerStartTime')
            .value;

        if (timeValue) {
            const timeParts = timeValue.split(':');
            const triggerStartWithTime = _m(
                this.currentTrigger.triggerStart
            ).set({
                h: +timeParts[0],
                m: +timeParts[1]
            });
            this.currentTrigger.triggerStart = triggerStartWithTime.toDate();
        }

        const triggerDiagResult: IDialogResult<Trigger> = {
            value: this.currentTrigger,
            confirmAdd: true
        };
        this.dialogRef.close(triggerDiagResult);
    }

    private createFormsAndValidators(): void {
        const formModel: Partial<TriggerFormModel> = {};
        const trigType = this.currentTrigger.entityType;

        const formValidators =
            trigType.custom && trigType.custom.formValidators;

        /** Loop through the needed form props and create the form control with validators */
        this.modelProps.forEach(prop => {
            formModel[prop] = new FormControl(this.currentTrigger[prop], {
                validators: formValidators && formValidators.propVal.get(prop),
                updateOn: 'blur'
            });
        });

        this.triggerFormGroup = this.formBuilder.group(formModel);

        const frmGrpValidator = trigType.custom.formValidators.entityVal.map(
            ev => ev(this.currentTrigger)
        );

        this.triggerFormGroup.setValidators(
            Validators.compose(frmGrpValidator)
        );

        if (this.currentTrigger.triggerStart) {
            formModel.triggerStart.setValue(_m(this.currentTrigger.triggerStart), {
                emitEvent: false,
                onlySelf: true
            });
            formModel.triggerStart.setValue(
                _m(this.currentTrigger.triggerStart)
                    .clone()
                    .format('H:m'),
                { emitEvent: false, onlySelf: true }
            );
        }
    }

    cancel(): void {
        this.currentTrigger.entityAspect.rejectChanges();
        const result: IDialogResult<Trigger> = {
            wasConceled: true
        };
        this.dialogRef.close(result);
    }

    deleteTrigger(): void {
        if (
            this.currentTrigger.entityAspect.entityState.isAdded &&
            !this.currentTrigger.triggerActions.length
        ) {
            this.currentTrigger.entityAspect.rejectChanges();
            /**
             * Report back to the caller that trigger has been soft deleted and
             * notify view that the deletion was successfull.
             */
            const diaResult: IDialogResult<Trigger> = {
                confirmDeletion: true
            };

            return this.dialogRef.close(diaResult);
        }

        const config: sa.SweetAlertOptions = {
            title: 'Delete Trigger?',
            text: `Are you sure you?
            All associated trigger action will be deleted as well!
            This action cannot be undone!`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        };
        sa.default.fire(config).then(result => {
            if (!result.value) {
                return;
            }
            /**
             * if the trigger has been marked as deleted, then all children
             * (triggerActions) and grandchildren (atas) should be marked as
             * soft deleted.
             */
            const atas = _.flatMap(
                this.currentTrigger.triggerActions,
                x => x.assetTriggerActions
            );
            atas.forEach(ata => ata.entityAspect.setDeleted());
            this.currentTrigger.triggerActions.forEach(ta =>
                ta.entityAspect.setDeleted()
            );
            /**
             * Report back to the caller that trigger has been soft deleted and
             * notify view that the deletion was successfull.
             */
            const diaResult: IDialogResult<Trigger> = {
                confirmDeletion: true
            };

            sa.default.fire(
                'Deleted!',
                'The trigger, trigger actions, and asset trigger action were marked for deletion',
                'success'
            );

            this.dialogRef.close(diaResult);
        });
    }

    triggerIsNew(): boolean {
        return this.currentTrigger.entityAspect.entityState.isAdded();
    }
}
