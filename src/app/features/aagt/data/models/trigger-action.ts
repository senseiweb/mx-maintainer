import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import * as ebase from 'app/global-data';
import {
    BzDataProp,
    BzEntity,
    BzNavProp
} from 'app/global-data/models/_entity-decorators';
import { ActionItem } from './action-item';
import { AssetTriggerAction } from './asset-trigger-action';
import { Trigger } from './trigger';

export interface ITriggerActionItemShell {
    id?: number;
    sequence?: number;
    shortCode?: string;
    action?: string;
    duration?: number;
    formattedDuration: string;
    teamCategory?: string;
}

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.TriggerAction })
export class TriggerAction extends ebase.SpEntityBase {
    private _actionItemId: number;
    private _triggerId: number;
    private _sequence: number;

    @BzDataProp()
    title: string;

    @BzDataProp()
    totalExecutionTime: number;

    @BzDataProp()
    averageExecutionTime: number;

    @BzDataProp()
    get sequence(): number {
        return this._sequence;
    }
    set sequence(id: number) {
        this._sequence = id;
        this.title = `${this._actionItemId}/${this._triggerId}/${
            this._sequence
        }`;
    }

    @BzDataProp()
    get actionItemId(): number {
        return this._actionItemId;
    }
    set actionItemId(id: number) {
        this._actionItemId = id;
        this.title = `${this.actionItemId}/${this._triggerId}/${
            this._sequence
        }`;
    }

    @BzDataProp()
    get triggerId(): number {
        return this._triggerId;
    }
    set triggerId(id: number) {
        this._triggerId = id;
        this.title = `${this._actionItemId}/${this._triggerId}/${
            this._sequence
        }`;
    }

    @BzNavProp<TriggerAction>('actionItemId')
    actionItem: ActionItem;

    @BzNavProp<TriggerAction>('triggerId')
    trigger: Trigger;

    @BzNavProp()
    assetTriggerActions: AssetTriggerAction[];
}

// @Injectable({
//     providedIn: AagtDataModule
// })
// export class TriggerActionMetadata extends ebase.MetadataBase<TriggerAction> {
//     metadataFor = TriggerAction;

//     constructor() {
//         super(SpListName.TriggerAction);
//         this.entityDefinition.dataProperties.title = {
//             dataType: this.dt.String,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.sequence = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.totalExecutionTime = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.averageExecutionTime = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.actionItemId = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.triggerId = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };

//         this.entityDefinition.navigationProperties = {
//             trigger: {
//                 entityTypeName: SpListName.Trigger,
//                 associationName: 'Trigger_Action',
//                 foreignKeyNames: ['triggerId']
//             },
//             actionItem: {
//                 entityTypeName: SpListName.ActionItem,
//                 associationName: 'Action_Trigger',
//                 foreignKeyNames: ['actionItemId']
//             },
//             assetTriggerActions: {
//                 entityTypeName: SpListName.AssetTriggerAction,
//                 associationName: 'TrigAsset_AssetTrigAction',
//                 isScalar: false
//             }
//         };

//         Object.assign(
//             this.entityDefinition.dataProperties,
//             this.baseDataProperties
//         );
//     }
// }
