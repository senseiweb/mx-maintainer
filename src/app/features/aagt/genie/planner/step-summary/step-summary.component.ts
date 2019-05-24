import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { Trigger } from 'app/features/aagt/data';
import { SpEntityBase } from 'app/global-data';
import { SaveResult } from 'breeze-client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { PlannerSteps } from '../planner.component';

interface IChangeSet {
    entity: SpEntityBase;
    shortName: string;
    entityState: string;
    status: string;
    dataProps: Array<{
        propertyName: string;
        newValue: string;
        oldValue: string;
    }>;
}

@Component({
    selector: 'genie-plan-step-summary',
    templateUrl: './step-summary.component.html',
    styleUrls: ['./step-summary.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand]
})
export class StepSummaryComponent implements OnInit, OnDestroy {
    currentTrigger: Trigger;
    ignoreProperties = [
        'id',
        'authorId',
        'editorId',
        'created',
        'modified',
        '__metadata'
    ];
    displayedColumns = ['dataProperty', 'newValue', 'oldValue'];
    changeSet: IChangeSet[];
    panelIndex: number;
    private unsubscribeAll: Subject<any>;

    constructor(private uow: PlannerUowService) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        // this.uow.onStepperChange
        //     .pipe(takeUntil(this.unsubscribeAll))
        //     .subscribe(stepEvent => {
        //         if (stepEvent.selectedIndex !== 3) {
        //             return;
        //         }
        //         const changes = this.uow.reviewChanges() as SpEntityBase[];
        //         this.changeSet = this.buildChangeSet(changes);
        //     });
    }

    buildChangeSet(changes: SpEntityBase[]): IChangeSet[] {
        return changes.map(chng => {
            const props = chng.entityType
                .getProperties()
                .filter(dp => !this.ignoreProperties.some(p => p === dp.name));
            const cSet = {
                entity: chng,
                status: 'UNSAVED',
                shortName: chng.entityType.shortName,
                entityState: chng.entityAspect.entityState.toString(),
                dataProps: []
            };
            if (chng.entityAspect.entityState.isAdded()) {
                cSet.dataProps = props.map(p => {
                    return {
                        propertyName: p.nameOnServer,
                        newValue: chng[p.name],
                        oldValue: ''
                    };
                });
            }
            if (chng.entityAspect.entityState.isModified()) {
                cSet.dataProps = props.map(p => {
                    return {
                        propertyName: p.nameOnServer,
                        newValue: chng[p.name],
                        oldValue: chng.entityAspect.originalValues[p.name]
                    };
                });
            }
            if (chng.entityAspect.entityState.isDeleted()) {
                cSet.dataProps = props.map(p => {
                    return {
                        propertyName: p.nameOnServer,
                        newValue: 'Scheduled For Deletion',
                        oldValue: chng[p.name]
                    };
                });
            }
            return cSet;
        });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    reset(): void {
        this.uow.rejectAllChanges();
        this.uow.onStepValidityChange.next({
            [PlannerSteps[PlannerSteps.Summary]]: {
                isValid: false
            }
        });
    }

    async saveChanges(): Promise<void> {
        let saveResult: SaveResult;

        const genChanges = this.changeSet.some(
            cs => cs.shortName === 'Generation'
        );
        if (genChanges) {
            this.setSavingStatus('Generation');
            try {
                saveResult = await this.uow.saveEntityChanges('Generation');
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    'Generation'
                );
            } catch (e) {}
        }

        const trigChanges = this.changeSet.some(
            cs => cs.shortName === 'Trigger'
        );
        if (trigChanges) {
            this.setSavingStatus('Trigger');
            try {
                saveResult = await this.uow.saveEntityChanges('Trigger');
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    'Trigger'
                );
            } catch (e) {}
        }

        const genAssetChanages = this.changeSet.some(
            cs => cs.shortName === 'GenerationAsset'
        );
        if (genAssetChanages) {
            this.setSavingStatus('GenerationAsset');
            try {
                saveResult = await this.uow.saveEntityChanges(
                    'GenerationAsset'
                );
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    'GenerationAsset'
                );
            } catch (e) {}
        }

        const trigActions = this.changeSet.some(
            cs => cs.shortName === 'TriggerAction'
        );
        if (trigActions) {
            this.setSavingStatus('TriggerAction');
            try {
                saveResult = await this.uow.saveEntityChanges('TriggerAction');
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    'TriggerAction'
                );
            } catch (e) {}
        }

        const assetTrigActs = this.changeSet.some(
            cs => cs.shortName === 'AssetTriggerAction'
        );
        if (assetTrigActs) {
            this.setSavingStatus('AssetTriggerAction');
            try {
                saveResult = await this.uow.saveEntityChanges(
                    'AssetTriggerAction'
                );
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    'AssetTriggerAction'
                );
            } catch (e) {}
        }
    }

    setSavingStatus(entityType: string) {
        this.changeSet.forEach(cs => {
            if (cs.shortName === entityType) {
                cs.status = 'SAVING';
            }
        });
    }

    setSavedStatus(errorEntity: SpEntityBase[], entityTypeName: string) {
        this.changeSet.forEach(cs => {
            if (cs.shortName !== entityTypeName) {
                return;
            }
            errorEntity.some(err => err.id === cs.entity.id)
                ? (cs.status = 'SAVE ERROR')
                : (cs.status = 'SUCCESS');
            cs.entityState = 'SAVED';
        });
    }

    setPanel(index: number): void {
        this.panelIndex = index;
    }
}
