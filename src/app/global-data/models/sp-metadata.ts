import { BzProp, BzEntity } from './decorators';

@BzEntity('Global', {
    isComplexType: true,
    namespace: 'SP.Data'
})
export class SpMetadata {
    readonly shortname = '__metadata';
    @BzProp('data', {})
    id: string;
    @BzProp('data', {})
    uri: string;
    @BzProp('data', {})
    etag: string;
    @BzProp('data', {})
    type: string;
}
