import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PlannerUowService } from '../planner-uow.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Asset } from 'app/features/aagt/data';

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

    constructor(private uow: PlannerUowService, private formBuilder: FormBuilder) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.step1FormGroup = this.createStep1Form();
        this.step1AssetFormGroup = this.formBuilder.group({
            assetSelection: new FormControl()
        });
        this.step1AssetFormGroup
            .get('assetSelection')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe(selectedAssets => this.assetSelectionChanged(selectedAssets));
        this.step1FormGroup.statusChanges.pipe(takeUntil(this.unsubscribeAll)).subscribe(() => {
            this.uow.onStep1ValidityChange.next(this.step1AssetFormGroup.valid);
        });
        this.allAssets = this.uow.allAssetsOptions;
        this.isoOperations = this.uow.isoLookups;
        this.genAssetsSelected = this.uow.currentGen.generationAssets.map(genAsset => {
            return genAsset.asset.id;
        });
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    createStep1Form(): FormGroup {
        const stp = this.uow.currentGen;
        return this.formBuilder.group({
            title: new FormControl(stp.title),
            active: new FormControl(stp.active),
            iso: new FormControl(stp.iso),
            numberAssetsRequired: new FormControl(stp.numberAssetsRequired),
            startDt: new FormControl(stp.startDateTime),
            stopDt: new FormControl(stp.stopDateTime)
        });
    }

    assetSelectionChanged(selectedAssets: Asset[]): void {
        this.step1FormGroup.get('numberAssetsRequired').setValue(selectedAssets.length);
        this.uow.selectedAssets = selectedAssets;
    }
}
