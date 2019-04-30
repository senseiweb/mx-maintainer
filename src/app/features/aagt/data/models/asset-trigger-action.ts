import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import * as ebase from 'app/global-data';
import {
    BzDataProp,
    BzEntity,
    BzNavProp
} from 'app/global-data/models/_entity-decorators';
import { DataType, EntityAction, EntityState } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import { GenerationAsset } from './generation-asset';
import { Team } from './team';
import { TriggerAction } from './trigger-action';

type AtaAllowedActionStatus = | 'Planned'
    | 'Unscheduled'
    | 'In-progress'
    | 'Scheduled'
    | 'Rescheduled'
    | 'Delayed';

type AtaAllowedOutcomes = 
| 'PCW'
| 'completed [on-time]'
| 'completed [early]'
| 'completed [late]'
| 'blamed'
| 'untouched';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.AssetTriggerAction })
export class AssetTriggerAction extends ebase.SpEntityBase {
    @BzDataProp({
        dataType: DataType.Int16
    })
    sequence: number;

    @BzDataProp({
        dataType: DataType.DateTime,
        spInternalName: 'Title',
        isNullable: false
    })
    actionStatus: AtaAllowedActionStatus;
    
    @BzDataProp({
        dataType: DataType.String
    })
    outcome: AtaAllowedOutcomes;

    @BzDataProp()
    plannedStart: Date;

    @BzDataProp()
    plannedStop: Date;

    @BzDataProp()

    scheduledStart: Date;

    @BzDataProp()
    scheduledStop: Date;

    @BzDataProp()
    actualStart: Date;

    @BzDataProp()
    actualStop: Date;

    @BzDataProp()
    completedByTeamId?: number;


    completedByTeam?: Team;

    @BzDataProp()
    genAssetId: number;

    @BzDataProp()
    triggerActionId: number;

    @BzDataProp()
    isConcurrentable: boolean;

    @BzNavProp<AssetTriggerAction>({
        rt: 'GenerationAsset',
        fk: 'genAssetId'})
    genAsset: GenerationAsset;

    @BzNavProp<AssetTriggerAction>({
        rt: 'TriggerAction',
        fk: 'triggerActionId'
    })
    triggerAction: TriggerAction;
}

// @Injectable({ providedIn: AagtDataModule })
// export class AssetTriggerActionMetadata extends ebase.MetadataBase<
//     AssetTriggerAction
// > {
//     metadataFor = AssetTriggerAction;

//     constructor() {
//         super(SpListName.AssetTriggerAction);
//         this.entityDefinition.dataProperties.actionStatus = {
//             dataType: this.dt.String,
//             spInternalName: 'Title',
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.sequence = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };

//         this.entityDefinition.dataProperties.outcome = {
//             dataType: this.dt.String,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.isConcurrentable = {
//             dataType: this.dt.Boolean,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.plannedStart = {
//             dataType: this.dt.DateTime
//         };
//         this.entityDefinition.dataProperties.plannedStop = {
//             dataType: this.dt.DateTime
//         };
//         this.entityDefinition.dataProperties.scheduledStart = {
//             dataType: this.dt.DateTime
//         };
//         this.entityDefinition.dataProperties.scheduledStop = {
//             dataType: this.dt.DateTime
//         };
//         this.entityDefinition.dataProperties.actualStart = {
//             dataType: this.dt.DateTime
//         };
//         this.entityDefinition.dataProperties.actualStop = {
//             dataType: this.dt.DateTime
//         };
//         this.entityDefinition.dataProperties.genAssetId = {
//             dataType: this.dt.Int32,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.triggerActionId = {
//             dataType: this.dt.Int32,
//             isNullable: false
//         };

//         this.entityDefinition.navigationProperties = {
//             genAsset: {
//                 entityTypeName: SpListName.GenerationAsset,
//                 foreignKeyNames: ['genAssetId'],
//                 associationName: 'GenAsset_AssetTrigAction'
//             },
//             triggerAction: {
//                 entityTypeName: SpListName.TriggerAction,
//                 foreignKeyNames: ['triggerActionId'],
//                 associationName: 'TrigAsset_AssetTrigAction'
//             }
//         };

//         Object.assign(
//             this.entityDefinition.dataProperties,
//             this.baseDataProperties
//         );
//     }
// }
