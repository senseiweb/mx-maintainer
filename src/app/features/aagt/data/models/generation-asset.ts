import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import { Asset } from './asset';
import { AssetTriggerAction } from './asset-trigger-action';
import { Generation } from './generation';

export type AssetStatus = 'FMC' | 'PMC' | 'NMC' | 'UNKNOWN';

@BzEntity(MxmAppName.Aagt, {})
export class GenerationAsset extends SpEntityBase {
    readonly shortname = 'GenerationAsset';
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
