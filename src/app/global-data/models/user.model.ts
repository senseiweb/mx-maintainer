import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import { GlobalDataModule } from '../data.module';

export class GlobalUser extends ebase.SpEntityBase {
    title: string;
}

@Injectable({ providedIn: GlobalDataModule })
export class GlobalUserMetadata extends ebase.MetadataBase<GlobalUser> {
    metadataFor = GlobalUser;

    constructor() {
        super('UserItem');
        this.entityDefinition.dataProperties.title = {
            dataType: this.dt.String
        };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
