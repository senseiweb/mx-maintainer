import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
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
    teamType?: string;
}
export class TriggerAction extends ebase.SpEntityBase {
    private _actionItemId: number;
    private _triggerId: number;
    private _sequence: number;
    title: string;
    totalExecutionTime: number;
    averageExecutionTime: number;
    get sequence(): number {
        return this._sequence;
    }
    set sequence(id: number) {
        this._sequence = id;
        this.title = `${this._actionItemId}/${this._triggerId}/${this._sequence}`;
    }
    get actionItemId(): number {
        return this._actionItemId;
    }
    set actionItemId(id: number) {
        this._actionItemId = id;
        this.title = `${this.actionItemId}/${this._triggerId}/${this._sequence}`;
    }
    get triggerId(): number {
        return this._triggerId;
    }
    set triggerId(id: number) {
        this._triggerId = id;
        this.title = `${this._actionItemId}/${this._triggerId}/${this._sequence}`;
    }
    actionItem: ActionItem;
    trigger: Trigger;
    assetTriggerActions: AssetTriggerAction[];
}

@Injectable({
    providedIn: AagtDataModule
})
export class TriggerActionMetadata extends ebase.MetadataBase<TriggerAction> {
    metadataFor = TriggerAction;

    constructor() {
        super(aagtCfg.AagtListName.TriggerAct);
        this.entityDefinition.dataProperties.title = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.sequence = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.totalExecutionTime = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.averageExecutionTime = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.actionItemId = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.triggerId = {
            dataType: this.dt.Int16,
            isNullable: false
        };

        this.entityDefinition.navigationProperties = {
            trigger: {
                entityTypeName: aagtCfg.AagtListName.Trigger,
                associationName: 'Trigger_Action',
                foreignKeyNames: ['triggerId']
            },
            actionItem: {
                entityTypeName: aagtCfg.AagtListName.ActionItem,
                associationName: 'Action_Trigger',
                foreignKeyNames: ['actionItemId']
            },
            assetTriggerActions: {
                entityTypeName: aagtCfg.AagtListName.AssetTrigAct,
                associationName: 'TrigAsset_AssetTrigAction',
                isScalar: false
            }
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
