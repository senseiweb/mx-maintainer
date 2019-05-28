import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import { fuseAnimations } from '@fuse/animations';
import { MinutesExpand } from 'app/common';
import { Trigger } from 'app/features/aagt/data';
import { SpEntityBase } from 'app/global-data';
import { SaveResult } from 'breeze-client';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';
import { PlannerSteps } from '../planner.component';
import { SpListEntities } from '@ctypes/app-config';
import { MatSnackBar } from '@angular/material';

interface IChangeSet {
    entity: SpEntityBase;
    shortName: SpListEntities['shortname'];
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
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        'shortname',
        '__metadata'
    ];
    displayedColumns = ['dataProperty', 'newValue', 'oldValue'];
    isWorking = false;
    changeSet: IChangeSet[];
    panelIndex: number;
    private unsubscribeAll: Subject<any>;

    constructor(
        private planUow: PlannerUowService,
        private cdRef: ChangeDetectorRef,
        private matSnackBar: MatSnackBar
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.planUow.onStepperChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(stepEvent => {
                if (stepEvent.selectedIndex !== 4) {
                    return;
                }
                this.cdRef.markForCheck();
                this.isWorking = true;
                setTimeout(() => {
                    const changes = this.planUow.reviewChanges() as SpEntityBase[];
                    this.changeSet = this.buildChangeSet(changes);
                    this.isWorking = false;
                    this.cdRef.markForCheck();
                }, 1000);
            });
    }

    buildChangeSet(changes: SpEntityBase[]): IChangeSet[] {
        return changes.map(chng => {
            const props = chng.entityType
                .getProperties()
                .filter(dp => !dp.isNavigationProperty && !dp.isUnmapped)
                .filter(dp => {
                    return !this.ignoreProperties.some(p => p === dp.name);
                });
            const cSet = {
                entity: chng,
                status: 'UNSAVED',
                shortName: chng.shortname as any,
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
        this.planUow.rejectAllChanges();
        this.planUow.onStepValidityChange.next({
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
                saveResult = await this.planUow.saveEntityChanges('Generation');
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    'Generation'
                );
            } catch (e) {}
        }

        const teamChanges = this.changeSet.some(cs => cs.shortName === 'Team');

        if (teamChanges) {
            this.setSavingStatus('Team');

            try {
                saveResult = await this.planUow.saveEntityChanges('Team');
                this.setSavedStatus(saveResult.entitiesWithErrors as any, 'Team');
            } catch (e) { }
        }

        const teamAvailChanges = this.changeSet.some(cs => cs.shortName === 'TeamAvailability');

        if (teamAvailChanges) {
            this.setSavingStatus('TeamAvailability');

            try {
                saveResult = await this.planUow.saveEntityChanges('TeamAvailability');
                this.setSavedStatus(saveResult.entitiesWithErrors as any, 'TeamAvailability');
            } catch (e) { }
          
        }

        const trigChanges = this.changeSet.some(
            cs => cs.shortName === 'Trigger'
        );
        if (trigChanges) {
            this.setSavingStatus('Trigger');
            try {
                saveResult = await this.planUow.saveEntityChanges('Trigger');
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
                saveResult = await this.planUow.saveEntityChanges(
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
                saveResult = await this.planUow.saveEntityChanges(
                    'TriggerAction'
                );
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
                saveResult = await this.planUow.saveEntityChanges(
                    'AssetTriggerAction'
                );
                this.setSavedStatus(
                    saveResult.entitiesWithErrors as any,
                    'AssetTriggerAction'
                );
            } catch (e) {}
        }

        const tjrChanges = this.changeSet.some(
            cs => cs.shortName === 'TeamJobReservation');

        if (tjrChanges) {
            this.setSavingStatus('TeamJobReservation');

            try {
                saveResult = await this.planUow.saveEntityChanges('TeamJobReservation');
                this.setSavedStatus(saveResult.entitiesWithErrors as any, 'TeamJobReservation');
            } catch (e) { }
        }

        if (this.changeSet.some(cs => cs.status === 'SAVE ERROR')) {
            this.matSnackBar.open('Some changes were not saved appropriately. Please reviewed the each change status', 'OK', {
                verticalPosition: 'top',
                duration: 2000
            });
        }
        this.cdRef.markForCheck();
    }

    setSavingStatus(shortname: SpListEntities['shortname']) {
        this.changeSet.forEach(cs => {
            if (cs.shortName === shortname) {
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
