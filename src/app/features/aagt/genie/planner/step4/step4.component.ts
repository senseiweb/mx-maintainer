import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import {
    AagtListName,
    ActionItem,
    Generation,
    ITriggerActionItemShell,
    Trigger,
    TriggerAction
} from 'app/features/aagt/data';
import { AagtEmProviderService } from 'app/features/aagt/data/aagt-emprovider.service';
import { SpEntityBase } from 'app/global-data';
import {
    Entity,
    EntityAction,
    EntityProperty,
    EntityState,
    SaveResult
} from 'breeze-client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';

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
    selector: 'genie-plan-step4',
    templateUrl: './step4.component.html',
    styleUrls: ['./step4.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None,
    providers: [MinutesExpand]
})
export class Step4Component implements OnInit, OnDestroy {
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
        this.uow.onStepperChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(stepEvent => {
                if (stepEvent.selectedIndex !== 3) {
                    return;
                }
                const changes = this.uow.reviewChanges() as SpEntityBase[];
                this.changeSet = this.buildChangeSet(changes);
            });
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

        this.uow.onStep1ValidityChange.next(false);
    }

    async saveChanges(): Promise<void> {
        let saveResult: SaveResult;

        const genChanges = this.changeSet.some(
            cs => cs.shortName === AagtListName.Gen
        );
        if (genChanges) {
            this.setSavingStatus(AagtListName.Gen);
            try {
                saveResult = await this.uow.saveGeneration();
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    AagtListName.Gen
                );
            } catch (e) {}
        }

        const trigChanges = this.changeSet.some(
            cs => cs.shortName === AagtListName.Trigger
        );
        if (trigChanges) {
            this.setSavingStatus(AagtListName.Trigger);
            try {
                saveResult = await this.uow.saveTriggers();
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    AagtListName.Trigger
                );
            } catch (e) {}
        }

        const genAssetChanages = this.changeSet.some(
            cs => cs.shortName === AagtListName.GenAsset
        );
        if (genAssetChanages) {
            this.setSavingStatus(AagtListName.GenAsset);
            try {
                saveResult = await this.uow.saveGenAssets();
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    AagtListName.GenAsset
                );
            } catch (e) {}
        }

        const trigActions = this.changeSet.some(
            cs => cs.shortName === AagtListName.TriggerAct
        );
        if (trigActions) {
            this.setSavingStatus(AagtListName.TriggerAct);
            try {
                saveResult = await this.uow.saveTrigActions();
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    AagtListName.TriggerAct
                );
            } catch (e) {}
        }

        const assetTrigActs = this.changeSet.some(
            cs => cs.shortName === AagtListName.AssetTrigAct
        );
        if (assetTrigActs) {
            this.setSavingStatus(AagtListName.AssetTrigAct);
            try {
                saveResult = await this.uow.saveAssetTrigActions();
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    AagtListName.AssetTrigAct
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
