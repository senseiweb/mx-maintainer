import { Component, OnDestroy, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { Asset, Generation } from 'app/features/aagt/data';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';

@Component({
    selector: 'genie-plan-step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit, OnDestroy {
    allAssets: Asset[] = [];
    isoOperations: string[];
    genAssetsSelected = [];
    step1FormGroup: FormGroup;
    step1AssetFormGroup: FormGroup;
    private unsubscribeAll: Subject<any>;

    constructor(
        private uow: PlannerUowService,
        private formBuilder: FormBuilder
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.step1FormGroup = this.createStep1Form();
        this.step1AssetFormGroup = this.formBuilder.group({
            assetSelection: new FormControl()
        });
        this.uow.onStepperChange.subscribe(stepEvent => {
            if (stepEvent.previouslySelectedIndex === 0) {
                this.uow.assetSelectionCheck();
                Object.keys(this.step1FormGroup.controls).forEach(
                    (key: keyof bareEntity<Generation>) => {
                        const field = this.step1FormGroup.get(key);
                        if (field.dirty) {
                            this.uow.currentGen[key] = field.value;
                        }
                    }
                );
            }
        });
        this.step1AssetFormGroup
            .get('assetSelection')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe(selectedAssets =>
                this.assetSelectionChanged(selectedAssets)
            );

        this.step1FormGroup.statusChanges
            .pipe(debounceTime(1500))
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(() => {
                this.uow.onStep1ValidityChange.next(this.step1FormGroup.valid);
            });

        this.allAssets = this.uow.allAssetsOptions;
        this.isoOperations = this.uow.allIsoOptions;
        this.genAssetsSelected = this.uow.currentGen.generationAssets.map(
            genAsset => {
                return genAsset.asset.id;
            }
        );
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    createStep1Form(): FormGroup {
        const stp = this.uow.currentGen;
        return this.formBuilder.group({
            title: new FormControl(stp.title, [Validators.required]),
            active: new FormControl(stp.active),
            iso: new FormControl(stp.iso, [Validators.required]),
            assignedAssetCount: new FormControl(stp.assignedAssetCount, [
                Validators.required
            ]),
            genStartDate: new FormControl(stp.genStartDate),
            genEndDate: new FormControl(stp.genEndDate)
        });
    }

    assetSelectionChanged(selectedAssets: Asset[]): void {
        this.step1FormGroup
            .get('assignedAssetCount')
            .setValue(selectedAssets.length);
        this.uow.currentGen.assignedAssetCount = selectedAssets.length;
        this.uow.selectedAssets = selectedAssets;
    }
}
