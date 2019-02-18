import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Generation, Asset } from 'app/aagt/data';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { PlannerUowService } from '../planner-uow.service';

@Component({
    selector: 'genie-plan-step1',
    templateUrl: './step1.component.html',
    styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit, OnDestroy {

    allAssets: Asset[] = [];
    @Output() step1Status = new EventEmitter<boolean>();
    isoOperations: string[];
    genAssetsSelected = [];
    step1FormGroup: FormGroup;

    constructor(private uow: PlannerUowService,
    private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.step1FormGroup = this.createStep1Form();
        this.step1FormGroup.statusChanges.subscribe(() => {
            this.step1Status.emit(this.step1FormGroup.valid);
        });
        this.allAssets = this.uow.allAssets;
        this.isoOperations = this.uow.isoLookups;
        this.genAssetsSelected = this.uow.currentGen.generationAssets.map(genAsset => {
            return genAsset.asset.id;
        });
    }

    ngOnDestroy() {

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

    assignedAssetModelChange(selectedAssets: number[]): void {
        this.step1FormGroup
            .get('numberAssetsRequired')
            .setValue(selectedAssets.length);

        this.uow.currentGen.generationAssets.forEach(genAsset => {
            if (!selectedAssets.some(id => genAsset.assetId === id)) {
                genAsset.entityAspect.setDeleted();
            }
        });

        selectedAssets.forEach(id => {
            if (!this.uow.currentGen.generationAssets.some(genAsset => genAsset.assetId === id)) {
                const data = {
                    generationId: this.uow.currentGen.id,
                    assetId: id
                };
                this.uow.createGenerationAsset(data);
            }
        });
    }
}
