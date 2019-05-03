import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_IsRequired,
    SpEntityBase
} from 'app/global-data';
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
export class AssetTriggerAction extends SpEntityBase {
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
