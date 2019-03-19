import * as eb from '../models/_entity-base';
import { Instantiable } from '@ctypes/breeze-type-customization';
import { environment } from 'environments/environment';
import { BaseAdapter } from 'breeze-client';

export class EmProviderConfig {
    nameSpace: string;
    featureSpAppName: string;
    dsAdapter: BaseAdapter;
    constructor(public entities: Array<Instantiable<eb.MetadataBase<eb.SpEntityBase>>>) {}
}
