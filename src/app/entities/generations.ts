import { EntityBase } from './_entity-base'
import { SpMetadata } from './sp-metadata';
import { Injectable } from '@angular/core';

@Injectable()
export class GenerationOperation extends EntityBase {
    shortName = "Personnel";

    constructor() { 
        super();
        this.self = this;
        this.def.shortName = this.shortName;
        this.def.defaultResourceName = "";
        this.def.dataProperties = {
            Id: {
                dataType: this.dt.String,
                isNullable: false,
            }
        };

        Object.assign(this.def.dataProperties, this.coreProperties);
    }
    

    
    initializer(entity: GenerationOperation) { }
}