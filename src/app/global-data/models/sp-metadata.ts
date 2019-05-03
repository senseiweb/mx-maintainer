import { Injectable } from '@angular/core';
import { GlobalDataModule } from '../data.module';
import * as ebase from './_entity-base';
import { BzDataProp, BzEntity } from './decorators';

@BzEntity('Global', {
    shortName: '__metadata',
    isComplexType: true,
    namespace: 'SP.Data'
})
export class SpMetadata {
    @BzDataProp()
    id: string;
    @BzDataProp()
    uri: string;
    @BzDataProp()
    etag: string;
    @BzDataProp()
    type: string;
}
