import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';

import { MatDialog, MatDialogConfig } from '@angular/material';
import { Asset, Generation } from 'app/features/aagt/data';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { IStepperModel } from '../planner.component';
import { NewGenerationDialogComponent } from './new-generation/new-generation.dialog';

@Component({
    selector: 'genie-plan-gen-asset',
    templateUrl: './step-gen-asset.component.html',
    styleUrls: ['./step-gen-asset.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations: fuseAnimations
})
export class StepGenAssetComponent implements OnInit, OnDestroy {
    nonSelectedAssets: Asset[] = [];
    selectedAssets: Asset[] = [];
    currentGen: Generation;
    isoOperations: string[];
    // genAssetsSelected = [];
    private unsubscribeAll: Subject<any>;

    constructor(private uow: PlannerUowService, private genDialog: MatDialog) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        if (this.uow.currentGen.entityAspect.entityState.isAdded()) {
            setTimeout(() => this.addModifyGeneration(), 1500);
        }
        this.currentGen = this.uow.currentGen;
        this.uow.onStepperChange.subscribe(stepEvent => {
            if (stepEvent.previouslySelectedIndex === 0) {
                this.uow.assetSelectionCheck();
                // Object.keys(this.step1FormGroup.controls).forEach(
                //     (key: keyof bareEntity<Generation>) => {
                //         const field = this.step1FormGroup.get(key);
                //         if (field.dirty) {
                //             this.uow.currentGen[key] = field.value;
                //         }
                //     }
                // );
            }
        });

        if (this.currentGen.generationAssets) {
            this.currentGen.generationAssets.forEach(ga => {
                const ix = this.nonSelectedAssets.findIndex(
                    a => a.id === ga.assetId
                );
                this.selectedAssets.concat(
                    this.nonSelectedAssets.splice(ix, 1)
                );
            });
        }
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    addRemoveModifyAsset($event: { items: Asset[] }): void {
        this.currentGen.draftAssets = this.selectedAssets.map((sa, ix) => {
            sa['priority'] = ix + 1;
            return {
                priority: ix + 1,
                id: sa.id
            };
        });

        this.currentGen.assignedAssetCount = this.selectedAssets.length;

        this.nonSelectedAssets.forEach((sa, i) => {
            sa['priority'] = undefined;
        });
    }

    addModifyGeneration(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.panelClass = 'new-generation-dialog';
        dialogCfg.data = this.currentGen;
        this.genDialog
            .open(NewGenerationDialogComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(data => {
                const stepper: IStepperModel = {
                    genAsset: {
                        isValid: this.currentGen.entityAspect.validateEntity()
                    }
                };
                this.uow.onStepValidityChange.next(stepper);
            });
    }
}
