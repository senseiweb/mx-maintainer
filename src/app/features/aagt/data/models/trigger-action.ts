import { MxmAppName, SpListName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
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
    readonly shortname = SpListName.TriggerAction;

    private _actionItemId: number;
    private _triggerId: number;
    private _sequence: number;

    @BzProp('data', {})
    title: string;

    @BzProp('data', {})
    totalExecutionTime: number;

    @BzProp('data', {})
    averageExecutionTime: number;

    @BzProp('data', {})
    get sequence(): number {
        return this._sequence;
    }
    set sequence(id: number) {
        this._sequence = id;
        this.title = `${this._actionItemId}/${this._triggerId}/${
            this._sequence
        }`;
    }

    @BzProp('data', {})
    get actionItemId(): number {
        return this._actionItemId;
    }
    set actionItemId(id: number) {
        this._actionItemId = id;
        this.title = `${this.actionItemId}/${this._triggerId}/${
            this._sequence
        }`;
    }

    @BzProp('data', {})
    get triggerId(): number {
        return this._triggerId;
    }
    set triggerId(id: number) {
        this._triggerId = id;
        this.title = `${this._actionItemId}/${this._triggerId}/${
            this._sequence
        }`;
    }

    @BzProp('nav', {
        navCfg: {
            isScalar: true
        },
        relativeEntity: SpListName.ActionItem
    })
    actionItem: ActionItem;

    @BzProp('nav', {
        relativeEntity: SpListName.Trigger,
        navCfg: {
            isScalar: true
        }
    })
    trigger: Trigger;

    @BzProp('nav', {
        relativeEntity: SpListName.AssetTriggerAction
    })
    assetTriggerActions: AssetTriggerAction[];
}
