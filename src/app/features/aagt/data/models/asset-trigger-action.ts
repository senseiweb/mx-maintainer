import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { GenerationAsset } from './generation-asset';
import { TriggerAction } from './trigger-action';
import * as aagtCfg from './_aagt-feature-cfg';
import { AagtDataModule } from '../aagt-data.module';

export class AssetTriggerAction extends ebase.SpEntityBase {
    sequence: number;
    actionStatus: 'Unscheduled' | 'In-progress' | 'Scheduled' | 'Rescheduled' | 'Delayed';
    outcome: 'PCW' | 'On-time' | 'Under-time' | 'Over-time' | 'Blamed';
    plannedStart: Date;
    plannedStop: Date;
    scheduledStart: Date;
    scheduledStop: Date;
    actualStart: Date;
    actualStop: Date;
    genAssetId: number;
    triggerActionId: number;
    genAsset: GenerationAsset;
    triggerAction: TriggerAction;
}

@Injectable({ providedIn: AagtDataModule })
export class AssetTriggerActionMetadata extends ebase.MetadataBase<AssetTriggerAction> {
    metadataFor = AssetTriggerAction;

    constructor() {
        super(aagtCfg.AagtListName.AssetTrigAct);
        this.entityDefinition.dataProperties.actionStatus = {
            dataType: this.dt.String
        };
        this.entityDefinition.dataProperties.sequence = { dataType: this.dt.Int16 };
        this.entityDefinition.dataProperties.outcome = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.plannedStart = {
            dataType: this.dt.DateTime,
            isNullable: false
        };
        this.entityDefinition.dataProperties.plannedStop = {
            dataType: this.dt.DateTime,
            isNullable: false
        };
        this.entityDefinition.dataProperties.scheduledStart = {
            dataType: this.dt.DateTime,
            isNullable: false
        };
        this.entityDefinition.dataProperties.scheduledStop = {
            dataType: this.dt.DateTime,
            isNullable: false
        };
        this.entityDefinition.dataProperties.actualStart = {
            dataType: this.dt.DateTime,
            isNullable: false
        };
        this.entityDefinition.dataProperties.actualStop = {
            dataType: this.dt.DateTime,
            isNullable: false
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

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}