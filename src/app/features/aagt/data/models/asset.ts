import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import { GenerationAsset } from './generation-asset';

@BzEntity(MxmAppName.Aagt, {})
export class Asset extends SpEntityBase {
    readonly shortname = 'Asset';

    @BzProp('data', {
        dataCfg: { isNullable: false },
        spInternalName: 'Title'
    })
    alias: string;

    @BzProp('data', {})
    location: string;

    @BzProp('data', {})
    notes: string;

    @BzProp('nav', {
        relativeEntity: 'GenerationAsset'
    })
    assetGenerations: GenerationAsset[];
}
