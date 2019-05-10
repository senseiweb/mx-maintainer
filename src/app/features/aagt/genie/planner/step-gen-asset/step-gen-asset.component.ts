import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { bareEntity, IDialogResult } from '@ctypes/breeze-type-customization';
import { SpListName } from 'app/app-config.service';
import { Asset, Generation, GenerationAsset } from 'app/features/aagt/data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { IStepperModel, PlannerSteps } from '../planner.component';
import { GenerationDetailDialogComponent } from './gen-detail/gen-detail.dialog';

@Component({
    selector: 'genie-plan-gen-asset',
    templateUrl: './step-gen-asset.component.html',
    styleUrls: ['./step-gen-asset.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class StepGenAssetComponent implements OnInit, OnDestroy {
    unSelectedCahched: Asset[] = [];
    selectedCached: Asset[] = [];
    currentGen: Generation;
    isoOperations: string[];
    private unsubscribeAll: Subject<any>;

    constructor(private uow: PlannerUowService, private genDialog: MatDialog) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        if (this.uow.currentGen.entityAspect.entityState.isAdded()) {
            setTimeout(() => this.addModifyGeneration(), 1500);
        }
        this.currentGen = this.uow.currentGen;
        const assignedAssets = this.currentGen.generationAssets;
        const assets = this.uow.allAssets;
        assets.forEach(asset => {
            const assignedAsset = assignedAssets.find(
                aa => asset.id === aa.assetId
            );

            if (assignedAsset) {
                asset['mxPosition'] = assignedAsset.mxPosition;
                this.selectedCached.push(asset);
            } else {
                this.unSelectedCahched.push(asset);
            }
        });
        this.unSelectedCahched.sort(this.unselectedCacheSorter);
        this.selectedCached.sort(this.selectedCacheSorter);
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    addAsset($event: { items: Asset[] }): void {
        const alreadyAssigned = this.currentGen.generationAssets;
        $event.items.forEach(asset => {
            const alreadyExist = alreadyAssigned.find(
                aa => aa.assetId === asset.id
            );

            if (alreadyExist) {
                alreadyExist.isSoftDeleted = false;
            } else {
                const defaultProps: bareEntity<GenerationAsset> = {
                    generationId: this.currentGen.id,
                    assetId: asset.id
                };
                this.currentGen.createChild('Generation');
            }
        });

        this.rePrioritize();
    }

    addModifyGeneration(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.panelClass = 'generation-detail-dialog';
        dialogCfg.data = this.currentGen;
        dialogCfg.disableClose = true;
        this.genDialog
            .open(GenerationDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe<IDialogResult<Generation>>(takeUntil(this.unsubscribeAll))
            .subscribe(result => {
                const stepper: IStepperModel = {
                    [PlannerSteps[PlannerSteps.GenAsset]]: {
                        isValid: result.value.entityAspect.validateEntity()
                    }
                };
                this.uow.onStepValidityChange.next(stepper);
            });
    }

    removeAsset($event: { items: Asset[] }): void {
        const genAssets = this.currentGen.generationAssets;
        $event.items.forEach(asset => {
            const existingAsset = genAssets.find(ga => ga.assetId === asset.id);
            existingAsset.isSoftDeleted = true;
            asset['mxPosition'] = undefined;
        });

        this.currentGen.assignedAssetCount = genAssets.length;

        this.rePrioritize();
    }

    rePrioritize(): void {
        const genAssets = this.currentGen.generationAssets;
        this.selectedCached.forEach((scAsset, index) => {
            const mxPosition = index + 1;
            const genAsset = genAssets.find(ga => ga.assetId === scAsset.id);

            genAsset.mxPosition =
                genAsset.mxPosition !== mxPosition && mxPosition;

            scAsset['mxPosition'] = mxPosition;
        });

        this.unSelectedCahched.sort(this.unselectedCacheSorter);
    }

    private selectedCacheSorter = (a: Asset, b: Asset): number => {
        return a['mxPosition'] < b['mxPosition'] ? -1 : 1;
    }

    private unselectedCacheSorter = (a: Asset, b: Asset): number => {
        return a.alias < b.alias ? -1 : 1;
    }
}
