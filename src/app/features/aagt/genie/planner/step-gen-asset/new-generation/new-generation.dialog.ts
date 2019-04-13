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
import { ActivatedRoute, Route, Router } from '@angular/router';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { Generation, GenStatusEnum, Team } from 'app/features/aagt/data';
import { DataProperty } from 'breeze-client';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as sa from 'sweetalert2';
import { PlannerUowService } from '../../planner-uow.service';

type GenModelProps = keyof bareEntity<Generation> | 'planDateRange';
type GenFormModel = { [key in GenModelProps]: any };

@Component({
    selector: 'new-generation-dialog',
    templateUrl: './new-generation.dialog.html',
    styleUrls: ['./new-generation.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class NewGenerationDialogComponent implements OnInit, OnDestroy {
    currentGen: Generation;
    action: 'edit' | 'add';
    genFormGroup: FormGroup;
    dialogTitle: string;
    allIsos: string[];
    isNew = false;
    isValid = false;
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
        private dialogRef: MatDialogRef<NewGenerationDialogComponent>,
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
        private uow: PlannerUowService,
        @Inject(MAT_DIALOG_DATA) data: any
    ) {
        this.currentGen = data;
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        const gen = this.currentGen;
        this.rangeSet = !!(gen.genStartDate && gen.genEndDate);
        this.allIsos = this.uow.allIsoOptions;

        if (gen.entityAspect.entityState.isAdded()) {
            this.action = 'add';
            this.dialogTitle = 'Add New Generation';
            gen.genStatus = gen.genStatus || GenStatusEnum.draft;
        } else {
            this.action = 'edit';
            this.dialogTitle = `Edit Generation ${this.currentGen.title}`;
        }

        const formModel: GenFormModel = {} as any;
        const genType = gen.entityType;
        console.log(gen);

        this.modelProps.forEach(prop => {
            const dp = gen[prop] as DataProperty;
            console.log(dp);
            formModel[prop] = new FormControl(
                prop,
                genType.custom['validatorMap'][prop]
            );
        });

        this.genFormGroup = this.formBuilder.group({
            title: new FormControl(gen.title, [Validators.required]),
            isActive: new FormControl(gen.isActive),
            iso: new FormControl(gen.iso),
            assignedAssetCount: new FormControl(gen.assignedAssetCount),
            genStartDate: new FormControl(gen.genStartDate),
            genEndDate: new FormControl(gen.genEndDate),
            planDateRange: new FormControl(),
            genStatus: new FormControl(gen.genStatus)
        });

        this.genFormGroup.valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(value => {
                console.log(value);
            });

        this.genFormGroup.statusChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(valid => {
                this.isValid = valid === 'VALID';
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    cancel(): void {
        this.currentGen.entityAspect.rejectChanges();
        this.dialogRef.close();
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
            this.router.navigate(['../../action-items'], {
                relativeTo: this.route
            });
        } catch (e) {}
    }

    saveChanges(del: string): void {
        Object.keys(this.genFormGroup.controls).forEach(
            (key: keyof bareEntity<Team>) => {
                this.currentGen[key] = this.genFormGroup.get(key).value;
            }
        );
        this.dialogRef.close(this.currentGen);
    }
}
