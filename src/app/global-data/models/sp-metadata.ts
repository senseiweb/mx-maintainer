import { BzProp, BzEntity } from './decorators';

@BzEntity('Global', {
    isComplexType: true,
    namespace: 'SP.Data',
    shortName: '__metadata'
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
