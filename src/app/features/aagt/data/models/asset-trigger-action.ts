import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { EntityAction, EntityState } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
import { GenerationAsset } from './generation-asset';
import { Team } from './team';
import { TriggerAction } from './trigger-action';

export class AssetTriggerAction extends ebase.SpEntityBase {
    sequence: number;
    actionStatus:
        | 'Planned'
        | 'Unscheduled'
        | 'In-progress'
        | 'Scheduled'
        | 'Rescheduled'
        | 'Delayed';
    outcome:
        | 'PCW'
        | 'completed [on-time]'
        | 'completed [early]'
        | 'completed [late]'
        | 'blamed'
        | 'untouched';
    plannedStart: Date;
    plannedStop: Date;
    scheduledStart: Date;
    scheduledStop: Date;
    actualStart: Date;
    actualStop: Date;
    completedByTeamId?: number;
    completedByTeam?: Team;
    genAssetId: number;
    triggerActionId: number;
    isConcurrentable: boolean;
    genAsset: GenerationAsset;
    triggerAction: TriggerAction;
    preDeleteState: EntityState;
}

@Injectable({ providedIn: AagtDataModule })
export class AssetTriggerActionMetadata extends ebase.MetadataBase<
    AssetTriggerAction
> {
    metadataFor = AssetTriggerAction;

    constructor() {
        super(aagtCfg.AagtListName.AssetTrigAct);
        this.entityDefinition.dataProperties.actionStatus = {
            dataType: this.dt.String,
            spInternalName: 'Title',
            isNullable: false
        };
        this.entityDefinition.dataProperties.sequence = {
            dataType: this.dt.Int16,
            isNullable: false
        };

        this.entityDefinition.dataProperties.outcome = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.isConcurrentable = {
            dataType: this.dt.Boolean,
            isNullable: false
        };
        this.entityDefinition.dataProperties.plannedStart = {
            dataType: this.dt.DateTime
        };
        this.entityDefinition.dataProperties.plannedStop = {
            dataType: this.dt.DateTime
        };
        this.entityDefinition.dataProperties.scheduledStart = {
            dataType: this.dt.DateTime
        };
        this.entityDefinition.dataProperties.scheduledStop = {
            dataType: this.dt.DateTime
        };
        this.entityDefinition.dataProperties.actualStart = {
            dataType: this.dt.DateTime
        };
        this.entityDefinition.dataProperties.actualStop = {
            dataType: this.dt.DateTime
        };
        this.entityDefinition.dataProperties.genAssetId = {
            dataType: this.dt.Int32,
            isNullable: false
        };
        this.entityDefinition.dataProperties.triggerActionId = {
            dataType: this.dt.Int32,
            isNullable: false
        };

        this.entityDefinition.navigationProperties = {
            genAsset: {
                entityTypeName: aagtCfg.AagtListName.GenAsset,
                foreignKeyNames: ['genAssetId'],
                associationName: 'GenAsset_AssetTrigAction'
            },
            triggerAction: {
                entityTypeName: aagtCfg.AagtListName.TriggerAct,
                foreignKeyNames: ['triggerActionId'],
                associationName: 'TrigAsset_AssetTrigAction'
            }
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
