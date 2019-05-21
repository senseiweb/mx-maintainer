import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { IDialogResult, RawEntity } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { Asset, Generation, GenerationAsset } from 'app/features/aagt/data';
import * as _ from 'lodash';
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

    /** Called by the picker when items are added to selected list */
    addAsset($event: { items: Asset[] }): void {
        const exisitingGenAssets = this.currentGen.generationAssets;

        /** Flatten all trigAction and AssetTriggerAction to undelte if found */
        const triggerActions = _.flatMap(
            this.currentGen.triggers,
            x => x.triggerActions
        );
        const assetTrigActions = _.flatMap(
            triggerActions,
            x => x.assetTriggerActions
        );

        /**
         * Loap over all the asset items that were added to the selected list
         * for this generation.
         */
        $event.items.forEach(asset => {
            /** Check if this generation asset was already created */
            const existingGenAsset = exisitingGenAssets.find(
                aa => aa.assetId === asset.id
            );

            /**
             * If a matching GenerationAsset is found, then it must have been
             * soft deleted, instead of recreating simply un-softDelete them.
             * Then check if any grand children (Asset Trig Action) are eligible
             * to unsoft delete it.
             */
            if (existingGenAsset) {
                existingGenAsset.isSoftDeleted = false;

                /**
                 * Filter through all the Asset Trigger Actions and selected the
                 * ones where the co-parenet (Trigger Action) has not been softDeleted
                 * and is a child of this Generation Asset. If any exisit set their
                 * soft deletion flag to false.
                 */
                assetTrigActions
                    .filter(
                        ata =>
                            !ata.triggerAction.isSoftDeleted &&
                            ata.genAssetId === existingGenAsset.id
                    )
                    .forEach(ata => (ata.isSoftDeleted = false));
            } else {
                /**
                 * Since an exisiting GenerationAsset doesn't exists,
                 * create a new one, then loop through the exisiting but not
                 * soft-deleted co-parent (TriggerAction) and create children
                 */
                const defaultProps: RawEntity<GenerationAsset> = {
                    generationId: this.currentGen.id,
                    assetId: asset.id
                };
                const genAsset = this.currentGen.createChild(
                    'GenerationAsset',
                    defaultProps
                );
                triggerActions
                    .filter(ta => !ta.isSoftDeleted)
                    .forEach(triggerAction =>
                        triggerAction.createChild('AssetTriggerAction', {
                            genAsset,
                            triggerAction
                        })
                    );
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
                if (!result || result.wasConceled) {
                    return;
                }

                const stepper: IStepperModel = {
                    [PlannerSteps[PlannerSteps.GenAsset]]: {
                        isValid: result.value.entityAspect.validateEntity()
                    }
                };
                this.uow.onStepValidityChange.next(stepper);
            });
    }

    /** Called by the picker when items are added to selected list */
    removeAsset($event: { items: Asset[] }): void {
        const genAssets = this.currentGen.generationAssets;
        /**
         * Loap over all the asset items that were removed from the selected list
         * for this generation.
         */
        $event.items.forEach(asset => {
            /**
             * Marked the removed GenAsset as softDeleted and popagate the
             * the changes to any exisiting children (Asset Trigger Actions)
             */
            const existingGenAsset = genAssets.find(
                ga => ga.assetId === asset.id
            );
            existingGenAsset.isSoftDeleted = true;
            existingGenAsset.assetTriggerActions.forEach(
                ata => (ata.isSoftDeleted = true)
            );

            /**
             * Finally set the "mxPosition" as undefined so that the picker will
             * use the correct template.
             */
            asset['mxPosition'] = undefined;
        });

        this.currentGen.assignedAssetCount = genAssets.length;

        this.rePrioritize();
    }

    /**
     * Called by the picker when items are shuffled by the picker
     * or called internally whenever items are added or removed to
     * ensure the mxPosition are in a consistenent state.
     */
    rePrioritize(): void {
        const genAssets = this.currentGen.generationAssets;

        /**
         * Mx Position is determined the index of the asset as
         * displayed in the selected list. Iterate through the
         * selected list assigning (or reassigning) the mx position
         * based on the items index. Only change it if different, so that
         * we do not cause a false modification that Breeze will detect.
         */
        this.selectedCached.forEach((scAsset, index) => {
            const mxPosition = index + 1;
            const genAsset = genAssets.find(ga => ga.assetId === scAsset.id);

            genAsset.mxPosition =
                genAsset.mxPosition !== mxPosition && mxPosition;

            /**
             * Finally define the asset's "mxPosition" so that the picker will
             * use the correct template.
             */
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
