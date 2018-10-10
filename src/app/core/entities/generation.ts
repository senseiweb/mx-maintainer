import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';
import { Assumption } from './assumption';
import { Trigger } from './trigger';

export type GenStatus = 'Draft' | 'Planned' | 'Active' | 'Historical';

@Injectable({
    providedIn: 'root'
  })
export class Generation extends EntityBase {

    constructor(private _assumption: Assumption,
                     private _trigger: Trigger) {
        super('Generation');
        this.self = this;

        this.entityDefinition.dataProperties.title = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.active = {
            dataType: this.dt.Boolean,
            isNullable: false
        };
        this.entityDefinition.dataProperties.iso = {
            dataType: this.dt.String,
            isNullable: true
        };
        this.entityDefinition.dataProperties.status = {
            dataType: this.dt.String,
            isNullable: false,
        };
        this.entityDefinition.dataProperties.numberAssetsRequired = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.startDateTime = {
            dataType: this.dt.DateTime,
            isNullable: true
        };
        this.entityDefinition.dataProperties.stopDateTime = {
            dataType: this.dt.DateTime
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
        Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
    }

    title?: string;
    active?: boolean;
    iso?: string;
    status?: GenStatus;
    numberAssetsRequired?: number;
    startDateTime?: Date;
    stopDateTime?: Date;
    assumptions?: Array<Assumption>;
    triggers?: Array<Trigger>;

    initializer(entity: Generation) { }
}
