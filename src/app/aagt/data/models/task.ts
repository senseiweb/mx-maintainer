import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { Producer  } from './producer';
import { AagtModule } from 'app/aagt/aagt.module';
import { SpMultiLookup } from 'app/data/models/sp-multi-lookup';
import { MxmTag } from 'app/data';

export class Task extends ebase.SpEntityBase {
  shortCode: string;
  title: string;
  plannedDuration: number;
  notes: string;
  get tags(): Array<MxmTag> {
    const em = this.entityAspect.entityManager;
    return this.mxmFilterTagId.results.map(tagId => {
      return em.getEntityByKey('MxmTag', tagId) as MxmTag;
    });
  }
  set tags(tags: Array<MxmTag>) {
    const tagIds = tags.map(t => t.id);
    this.mxmFilterTagId.results = tagIds;
  }
  mxmFilterTagId: SpMultiLookup;
  producerId: string;
  producer: Producer;
}

@Injectable({
  providedIn: AagtModule
})
export class TaskMetadata extends ebase.MetadataBase<Task> {

  metadataFor = Task;

  constructor() {
    super('Task');
    this.entityDefinition.dataProperties.shortCode = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.title = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.plannedDuration = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.mxmFilterTagId = {
      complexTypeName: 'spMultiLookup',
      dataType: undefined
    };
    this.entityDefinition.dataProperties.notes = { dataType: this.dt.String, isNullable: false };
    this.entityDefinition.dataProperties.producerId = { dataType: this.dt.String, isNullable: false };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }

  initializer(entity: Task) { }

}
