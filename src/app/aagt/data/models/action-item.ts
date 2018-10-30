import * as ebase from 'app/data/models/_entity-base';
import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import { MxFilterTag, SpMultiLookup } from 'app/data';

export class ActionItem extends ebase.SpEntityBase {
  action: string;
  shortCode: string;
  duration: string;
  assignedTeamType: string;
  status: string;
  get tags(): Array<MxFilterTag> {
    if (!this.entityAspect) { return []; }
    const em = this.entityAspect.entityManager;
    return this.mxFilterTagId.results.map(tagId => {
      return em.getEntityByKey('MxFilterTag', tagId) as MxFilterTag;
    });
  }
  set tags(tags: Array<MxFilterTag>) {
    const tagIds = tags.map(t => t.id);
    this.mxFilterTagId.results = tagIds;
  }
  mxFilterTagId: SpMultiLookup;
}

@Injectable({providedIn: AagtModule})
export class ActionItemMetadata extends ebase.MetadataBase<ActionItem> {

  metadataFor = ActionItem;

  constructor() {
    super('ActionItem');
    this.entityDefinition.dataProperties.action = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.shortCode = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.assignedTeamType = { dataType: this.dt.String };
    this.entityDefinition.dataProperties.duration = { dataType: this.dt.Int16 };
    this.entityDefinition.dataProperties.status = { dataType: this.dt.String };

    Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
  }
  initializer(entity: ActionItem) { }
}
