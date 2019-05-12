import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import { Asset } from './asset';
import { AssetTriggerAction } from './asset-trigger-action';
import { Generation } from './generation';

export type AssetStatus = 'FMC' | 'PMC' | 'NMC' | 'UNKNOWN';

@BzEntity(MxmAppName.Aagt, {})
export class GenerationAsset extends SpEntityBase {
    readonly shortname = 'GenerationAsset';

    @BzProp('data', {})
    health: AssetStatus;

    @BzProp('data', {})
    mxPosition: number;

    @BzProp('nav', {
        relativeEntity: 'Asset',
        navCfg: {
            isScalar: true
        }
    })
    asset: Asset;

    @BzProp('nav', {
        relativeEntity: 'Generation',
        navCfg: {
            isScalar: true
        }
    })
    generation: Generation;

    @BzProp('data', {
        dataCfg: { isNullable: false }
    })
    generationId: number;

    @BzProp('data', {
        dataCfg: {
            isNullable: false
        }
    })
    assetId: number;

    @BzProp('nav', {
        relativeEntity: 'AssetTriggerAction'
    })
    assetTriggerActions: AssetTriggerAction[];
}
