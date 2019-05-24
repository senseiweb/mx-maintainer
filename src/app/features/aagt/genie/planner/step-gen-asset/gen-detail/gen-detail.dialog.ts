import {
    ChangeDetectionStrategy,
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
    DateAdapter,
    MatDialogRef,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
    MAT_DIALOG_DATA
} from '@angular/material';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { IDialogResult, RawEntity } from '@ctypes/breeze-type-customization';
import { MY_FORMATS } from 'app/app-config.service';
import { Generation, GenStatusEnum, Team } from 'app/features/aagt/data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as sa from 'sweetalert2';
import { PlannerUowService } from '../../planner-uow.service';

type GenModelProps = keyof RawEntity<Generation> | 'genStartTime';
type GenFormModel = { [key in GenModelProps]: FormControl };

@Component({
    selector: 'generation-detail-dialog',
    templateUrl: './gen-detail.dialog.html',
    styleUrls: ['./gen-detail.dialog.scss'],
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GenerationDetailDialogComponent implements OnInit, OnDestroy {
    formMode: 'edit' | 'add';
    genFormGroup: FormGroup;
    dialogTitle: string;
    allIsos: string[];
    isNew = false;
    rangeSet = true;
    statusEnum = Object.keys(GenStatusEnum);
    private modelProps: GenModelProps[] = [
        'title',
        'assignedAssetCount',
        'isActive',
        'iso',
        'genStartDate',
        'genStartTime',
        'genStatus'
    ];
    private unsubscribeAll: Subject<any>;

    constructor(
        private dialogRef: MatDialogRef<GenerationDetailDialogComponent>,
        private formBuilder: FormBuilder,
        private uow: PlannerUowService,
        @Inject(MAT_DIALOG_DATA) private currentGen: Generation
    ) {
        this.allIsos = this.uow.allIsoOptions;
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        const gen = this.currentGen;

        // if no time is set...set default time to the next half hour
        if (!gen.genStartDate) {
            const start = _m();
            const remainder = 30 - (start.minute() % 30);
            const defaultStart = start.add(remainder, 'minute');
            gen.genStartDate = defaultStart.toDate();
        }

        if (gen.entityAspect.entityState.isAdded()) {
            this.formMode = 'add';
            this.dialogTitle = 'Add New Generation';
        } else {
            this.formMode = 'edit';
            this.dialogTitle = `Edit Generation ${this.currentGen.title}`;
        }

        this.createFormAndValidators();
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    createFormAndValidators(): void {
        const gen = this.currentGen;
        const formModel: Partial<GenFormModel> = {};

        const formValidators = gen.entityType.custom.formValidators;

        this.modelProps.forEach(prop => {
            formModel[prop] = new FormControl(
                this.currentGen[prop],
                formValidators && formValidators.propVal.get(prop)
            );
        });

        if (gen.genStartDate) {
            formModel.genStartDate.setValue(_m(gen.genStartDate), {
                emitEvent: false,
                onlySelf: true
            });
            formModel.genStartTime.setValue(
                _m(gen.genStartDate)
                    .clone()
                    .format('H:m'),
                { emitEvent: false, onlySelf: true }
            );
        }

        this.genFormGroup = this.formBuilder.group(formModel);

        /** Disable the asset count as it is updated by the selection of assets */
        formModel.assignedAssetCount.disable({
            onlySelf: true,
            emitEvent: false
        });
    }

    cancel(): void {
        this.currentGen.entityAspect.rejectChanges();
        const genDialogResult: IDialogResult<Team> = {
            wasConceled: true
        };
        this.dialogRef.close(genDialogResult);
    }

    async deleteGeneration(): Promise<void> {
        const config: sa.SweetAlertOptions = {
            title: 'Delete Entire Generation?',
            text: `Are you sure you?
            All associated generation items will be deleted!`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        };
        try {
            const result = await sa.default.fire(config);
            if (!result.value) {
                return;
            }

            const atas = _.flatMap(
                this.currentGen.generationAssets,
                x => x.assetTriggerActions
            );

            const trigActs = _.flatMap(
                this.currentGen.triggers,
                x => x.triggerActions
            );

            atas.forEach(ata => ata.entityAspect.setDeleted());

            trigActs.forEach(ta => ta.entityAspect.setDeleted());

            this.currentGen.triggers.forEach(ta =>
                ta.entityAspect.setDeleted()
            );

            this.currentGen.generationAssets.forEach(ga =>
                ga.entityAspect.setDeleted()
            );

            this.currentGen.entityAspect.setDeleted();
            const saveResult = await this.uow.saveAll();
            this.dialogRef.close(saveResult);
            await sa.default.fire(
                'Deleted!',
                'Team has been deleted',
                'success'
            );
        } catch (e) {}
    }

    saveChanges(): void {
        this.modelProps.forEach(prop => {
            const formValue = this.genFormGroup.get(prop).value;
            const currProp = this.currentGen[prop];
            if (prop === 'genStartDate') {
                this.currentGen.genStartDate = (formValue as _m.Moment).toDate();
            } else if (currProp !== formValue) {
                this.currentGen[prop as any] = formValue;
            }
        });

        const timeValue: string = this.genFormGroup.get('genStartTime').value;

        if (timeValue) {
            const timeParts = timeValue.split(':');
            const genStartWithTime = _m(this.currentGen.genStartDate).set({
                h: +timeParts[0],
                m: +timeParts[1]
            });
            this.currentGen.genStartDate = genStartWithTime.toDate();
        }

        const genDialogResult: IDialogResult<Generation> = {
            confirmChange: true,
            value: this.currentGen
        };
        this.dialogRef.close(genDialogResult);
    }
}
