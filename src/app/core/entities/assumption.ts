import * as ebase from './_entity-base';
import { Injectable } from '@angular/core';

export class Assumption extends ebase.SpEntityBase {
  area: string;
  category: string;
  remarks: string;
  generationId: number;
}

@Injectable({
  providedIn: 'root'
})
export class AssumptionMetadata extends ebase.MetadataBase {

   constructor() {
     super('Assumption');
     this.entityDefinition.dataProperties.area = { dataType: this.dt.String, isNullable: false };
     this.entityDefinition.dataProperties.category = { dataType: this.dt.String, isNullable: false };
     this.entityDefinition.dataProperties.remarks = { dataType: this.dt.String, isNullable: true };
     this.entityDefinition.dataProperties.generatorId = { dataType: this.dt.Int32, isNullable: false };

     Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
   }

  initializer(entity: Assumption) { }
}
