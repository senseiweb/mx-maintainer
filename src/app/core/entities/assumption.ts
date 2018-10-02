import { EntityBase } from './_entity-base';
import { Injectable } from '@angular/core';

@Injectable()
export class Assumption extends EntityBase {

   shortName = 'Assumption';

   constructor() {
     super();
     this.self = this;
     this.entityDefinition.shortName = this.shortName;
     this.entityDefinition.defaultResourceName = `/lists/getByTitle('${this.shortName}')/items`;
     this.entityDefinition.dataProperties.Area = { dataType: this.dt.String, isNullable: false };
     this.entityDefinition.dataProperties.Category = { dataType: this.dt.String, isNullable: false };
     this.entityDefinition.dataProperties.Remarks = { dataType: this.dt.String, isNullable: true };
     this.entityDefinition.dataProperties.GeneratorId = { dataType: this.dt.Int32, isNullable: false };

     Object.assign(this.entityDefinition.dataProperties, this.coreProperties);
   }

  area: string;
  category: string;
  remarks: string;
  generationId: number;

  initializer(entity: Assumption) { }
}
