import * as eb from '../global-models/_entity-base';
import { Instantiable } from '@ctypes/breeze-type-customization';
import { environment } from 'environments/environment';

export class EmProviderConfig {
    nameSpace: string;
    featureSpAppName: string;

    constructor(public entities: Array<Instantiable<eb.MetadataBase<eb.SpEntityBase>>>) {}
}
