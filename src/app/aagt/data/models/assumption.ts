import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import * as aagtCfg from './sp-aagt-config';
import { AagtDataModule } from '../aagt-data.module';

export class Assumption extends ebase.SpEntityBase {
    area: string;
    category: string;
    remarks: string;
    generationId: number;
}

@Injectable({
    providedIn: AagtDataModule
})
export class AssumptionMetadata extends ebase.MetadataBase<Assumption> {

    metadataFor = Assumption;

    constructor () {
        super('Assumption');
        this.entityDefinition.dataProperties.area = { dataType: this.dt.String, isNullable: false };
        this.entityDefinition.dataProperties.category = { dataType: this.dt.String, isNullable: false };
        this.entityDefinition.dataProperties.remarks = { dataType: this.dt.String, isNullable: true };
        this.entityDefinition.dataProperties.generationId = { dataType: this.dt.Int32, isNullable: false };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }

}
