import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { RawEntity, IDialogResult } from '@ctypes/breeze-type-customization';
import { Generation, GenStatusEnum, Team } from 'app/features/aagt/data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { Subject } from 'rxjs';
import * as sa from 'sweetalert2';
import { PlannerUowService } from '../../planner-uow.service';

type GenModelProps = keyof RawEntity<Generation> | 'planDateRange';
type GenFormModel = { [key in GenModelProps]: any };

@Component({
    selector: 'generation-detail-dialog',
    templateUrl: './gen-detail.dialog.html',
    styleUrls: ['./gen-detail.dialog.scss'],
    encapsulation: ViewEncapsulation.None
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
        'genEndDate',
        'genStartDate',
        'genStatus',
        'planDateRange'
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
            gen.genEndDate = defaultStart.add(1, 'day').toDate();
        }

        this.currentGen['planDateRange'] = [gen.genStartDate, gen.genEndDate];

        if (gen.entityAspect.entityState.isAdded()) {
            this.formMode = 'add';
            this.dialogTitle = 'Add New Generation';
        } else {
            this.formMode = 'edit';
            this.dialogTitle = `Edit Generation ${this.currentGen.title}`;
        }

        const formModel: Partial<GenFormModel> = {};
        const formValidators =
            gen.entityType.custom && gen.entityType.custom.formValidators;

        this.modelProps.forEach(prop => {
            formModel[prop] = new FormControl(
                this.currentGen[prop],
                formValidators && formValidators.propVal.get(prop)
            );
        });

        this.genFormGroup = this.formBuilder.group(formModel);
        this.genFormGroup
            .get('assignedAssetCount')
            .disable({ onlySelf: true, emitEvent: false });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
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
            if (prop === 'planDateRange' && formValue) {
                this.currentGen.genStartDate = formValue[0];
                this.currentGen.genEndDate = formValue[1];
            } else {
                const currProp = this.currentGen[prop];
                if (currProp !== formValue) {
                    this.currentGen[prop as any] = formValue;
                }
            }
        });

        const genDialogResult: IDialogResult<Generation> = {
            confirmChange: true,
            value: this.currentGen
        };
        this.dialogRef.close(genDialogResult);
    }
}
