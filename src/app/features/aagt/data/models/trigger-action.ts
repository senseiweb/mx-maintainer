import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_IsRequired,
    SpEntityBase
} from 'app/global-data';
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
export class TriggerAction extends SpEntityBase {
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

    @BzNavProp<TriggerAction>({
        rt: SpListName.ActionItem,
        fk: 'actionItemId'
    })
    actionItem: ActionItem;

    @BzNavProp<TriggerAction>({
        rt: SpListName.TriggerAction,
        fk: 'triggerId'
    })
    trigger: Trigger;

    @BzNavProp<TriggerAction>({
        rt: SpListName.TriggerAction
    })
    assetTriggerActions: AssetTriggerAction[];
}
