import { EntityBase, dt, baseDataProperties} from './_entity-base';
import { Injectable } from '@angular/core';
import { Assumption } from './assumption';
import { Trigger } from './trigger';

export enum genStatusEnum {
    draft = 'Draft',
    planned = 'Planned',
    active = 'Active',
    historical = 'Historical'
}

@Injectable({
    providedIn: 'root'
  })
export class Generation extends EntityBase {

    constructor(private _assumption: Assumption,
                     private _trigger: Trigger) {
        super('Generation');

        this.entityDefinition.dataProperties.title = {
            dataType: dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.active = {
            dataType: dt.Boolean,
            isNullable: false
        };
        this.entityDefinition.dataProperties.iso = {
            dataType: dt.String,
            isNullable: true
        };
        this.entityDefinition.dataProperties.status = {
            dataType: dt.String,
            isNullable: false,
        };
        this.entityDefinition.dataProperties.numberAssetsRequired = {
            dataType: dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.startDateTime = {
            dataType: dt.DateTime,
            isNullable: true
        };
        this.entityDefinition.dataProperties.stopDateTime = {
            dataType: dt.DateTime
        };
        // this.entityDefinition.navigationProperties.Assumptions = {
        //    entityTypeName: this._assumption.shortName,
        //    associationName: 'GeneratorAssumptions',
        //    foreignKeyNames: ['GenerationId']
        // };
        // this.entityDefinition.navigationProperties.Generation = {
        //    entityTypeName: this._trigger.shortName,
        //    associationName: 'GeneratorTriggers',
        //    foreignKeyNames: ['GenerationId']
        //  };
        Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
    }

    title?: string;
    active?: boolean;
    iso?: string;
    status?: genStatusEnum;
    numberAssetsRequired?: number;
    startDateTime?: Date;
    stopDateTime?: Date;
    assumptions?: Array<Assumption>;
    triggers?: Array<Trigger>;

    initializer(entity: Generation) { }
}
