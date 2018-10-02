import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';
import { Assumption } from './assumption';
import { Trigger } from './trigger';


@Injectable()
export class GeneratorOps extends EntityBase {
    shortName = 'Generator';

    constructor(private _assumption: Assumption,
                     private _trigger: Trigger) {
        super();
        this.self = this;
        this.entityDefinition.shortName = this.shortName;
        this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;

        this.entityDefinition.dataProperties.Title = {
            dataType: this.dt.String,
            isNullable: false
        };
        this.entityDefinition.dataProperties.Active = {
            dataType: this.dt.Boolean,
            isNullable: false
        };
        this.entityDefinition.dataProperties.ISO = {
            dataType: this.dt.String,
            isNullable: true
        };
        this.entityDefinition.dataProperties.NumberAssetsRequired = {
            dataType: this.dt.Int16,
            isNullable: false
        };
        this.entityDefinition.dataProperties.StartDateTime = {
            dataType: this.dt.DateTime,
            isNullable: true
        };
        this.entityDefinition.dataProperties.StopDateTime = {
            dataType: this.dt.DateTime
        };
        this.entityDefinition.navigationProperties.Assumptions = {
            entityTypeName: this._assumption.shortName,
            associationName: 'GeneratorAssumptions',
            foreignKeyNames: ['GenerationId']
        };
        this.entityDefinition.navigationProperties.Generation = {
            entityTypeName: this._trigger.shortName,
            associationName: 'GeneratorTriggers',
            foreignKeyNames: ['GenerationId']
          };
        Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
    }

    title: string;
    active: boolean;
    iso: string;
    assumptions: Array<Assumption>;
    triggers: Array<Trigger>;

    initializer(entity: GeneratorOps) { }
}
