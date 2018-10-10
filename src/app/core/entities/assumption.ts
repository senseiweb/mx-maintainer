import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Assumption extends EntityBase {


   constructor() {
     super('Assumption');
     this.self = this;
     this.entityDefinition.dataProperties.area = { dataType: this.dt.String, isNullable: false };
     this.entityDefinition.dataProperties.category = { dataType: this.dt.String, isNullable: false };
     this.entityDefinition.dataProperties.remarks = { dataType: this.dt.String, isNullable: true };
     this.entityDefinition.dataProperties.generatorId = { dataType: this.dt.Int32, isNullable: false };

     Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
   }

  area: string;
  category: string;
  remarks: string;
  generationId: number;

  initializer(entity: Assumption) { }
}
