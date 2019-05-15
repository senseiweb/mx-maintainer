import { MxmAppName } from 'app/app-config.service';
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

@BzEntity(MxmAppName.Aagt, {})
export class TriggerAction extends SpEntityBase {
    readonly shortname = 'TriggerAction';

    /**
     * When used, indicates that child entity will be deleted
     * during the next save operation. Prefer to use this method
     * when entities may be deleted and restored several times
     * before actual saving is done to store.
     *
     * Used instead of Breeze internal setDeleted() method becuase
     * setDeleted() assume the entity will not longer be reference, '
     * which cases all child and parent references to this entity
     * be dropped and a pain in the butt to be recovered later.
     */
    isSoftDeleted?: boolean;

    private _actionItemId: number;
    private _triggerId: number;
    private _sequence: number;

    @BzProp('data', {})
    title?: string;

    @BzProp('data', {})
    totalExecutionTime?: number;

    @BzProp('data', {})
    averageExecutionTime?: number;

    @BzProp('data', {})
    get sequence(): number {
        return this._sequence;
    }
    set sequence(newSequence: number) {
        this.assetTriggerActions.forEach(ata => {
            if (!ata.sequence || ata.sequence === this._sequence) {
                ata.sequence = newSequence;
            }
        });

        this._sequence = newSequence;
        this.title = `${this._actionItemId}/${this._triggerId}/${newSequence}`;
    }

    @BzProp('data', {})
    get actionItemId(): number {
        return this._actionItemId;
    }
    set actionItemId(id: number) {
        this._actionItemId = id;
        this.title = `${id}/${this._triggerId}/${this._sequence}`;
    }

    @BzProp('data', {})
    get triggerId(): number {
        return this._triggerId;
    }
    set triggerId(id: number) {
        this._triggerId = id;
        this.title = `${this._actionItemId}/${id}/${this._sequence}`;
    }

    @BzProp('nav', {
        navCfg: {
            isScalar: true
        },
        relativeEntity: 'ActionItem'
    })
    actionItem: ActionItem;

    @BzProp('nav', {
        relativeEntity: 'Trigger',
        navCfg: {
            isScalar: true
        }
    })
    trigger: Trigger;

    @BzProp('nav', {
        relativeEntity: 'AssetTriggerAction'
    })
    assetTriggerActions: AssetTriggerAction[];
}
