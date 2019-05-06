import { BzProp, BzEntity } from './decorators';

@BzEntity('Global', {
    shortName: '__metadata',
    isComplexType: true,
    namespace: 'SP.Data'
})
export class SpMetadata {
    @BzProp('data', {})
    id: string;
    @BzProp('data', {})
    uri: string;
    @BzProp('data', {})
    etag: string;
    @BzProp('data', {})
    type: string;
}
