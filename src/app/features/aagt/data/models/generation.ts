import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import * as _ from 'lodash';
import { AssetTriggerAction } from './asset-trigger-action';
import { Assumption } from './assumption';
import { GenerationAsset } from './generation-asset';
import { Trigger } from './trigger';

export enum GenStatusEnum {
    Draft = 'Draft',
    Planned = 'Planned',
    Active = 'Active',
    Historical = 'Historical'
}

@BzEntity(MxmAppName.Aagt, {})
export class Generation extends SpEntityBase {
    readonly shortname = 'Generation';

    @BzProp('data', {})
    title: string;

    @BzProp('data', {})
    isActive: boolean;

    @BzProp('data', {})
    iso: string;

    @BzProp('data', {})
    genStatus: GenStatusEnum;

    @BzProp('data', {})
    assignedAssetCount: number;

    @BzProp('data', {})
    genStartDate: Date;

    @BzProp('data', {})
    genEndDate: Date;

    assumptions: Assumption[];

    @BzProp('nav', {
        relativeEntity: 'Trigger'
    })
    triggers: Trigger[];

    @BzProp('nav', {
        relativeEntity: 'GenerationAsset'
    })
    generationAssets: GenerationAsset[];

    get assetTrigActions(): AssetTriggerAction[] {
        if (!this.generationAssets) {
            return;
        }
        return _.flatMap(this.generationAssets, x => x.assetTriggerActions);
    }
}
