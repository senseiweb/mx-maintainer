import { EntityBase, dt, baseDataProperties} from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Assumption extends EntityBase {


   constructor() {
     super('Assumption');
     this.entityDefinition.dataProperties.area = { dataType: dt.String, isNullable: false };
     this.entityDefinition.dataProperties.category = { dataType: dt.String, isNullable: false };
     this.entityDefinition.dataProperties.remarks = { dataType: dt.String, isNullable: true };
     this.entityDefinition.dataProperties.generatorId = { dataType: dt.Int32, isNullable: false };

     Object.assign(this.entityDefinition.dataProperties, baseDataProperties);
   }

  area: string;
  category: string;
  remarks: string;
  generationId: number;

  initializer(entity: Assumption) { }
}
