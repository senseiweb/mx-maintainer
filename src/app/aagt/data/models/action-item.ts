import { Injectable } from '@angular/core';
import { AagtModule } from 'app/aagt/aagt.module';
import * as ebase from 'app/data/models/_entity-base';
import * as aagtCfg from './sp-aagt-config';
import { AagtDataModule } from '../aagt-data.module';
import { TriggerAction } from './trigger-action';
export class ActionItem extends ebase.SpEntityBase {
    action: string;
    shortCode: string;
    duration: number;
    teamType: string;
    // Sharepoint handle yes/no boxes as 0:1 values to represet boolean;
    availableForUse: boolean;
    notes: string;
    actionTriggers: TriggerAction[];
    // get important(): boolean {
    //   if (!this.tags.length) { return false; }
    //   return this.tags.some(tag => tag.tagHandle === 'important');
    // }
    // get critical(): boolean {
    //   if (!this.tags.length) { return false; }
    //   return this.tags.some(tag => tag.tagHandle === 'critical');
    // }
    // get completed(): boolean {
    //   if (!this.tags.length) { return false; }
    //   return this.tags.some(tag => tag.tagHandle === 'done');
    // }
    // get tags(): MxFilterTag[] {
    //   if (!this.entityAspect) { return []; }
    //   const em = this.entityAspect.entityManager;
    //   return this.mxFilterTagId ? this.mxFilterTagId.results.map(tagId => {
    //     return em.getEntityByKey('MxFilterTag', tagId) as MxFilterTag;
    //   }) : [];
    // }
    // set tags(tags: MxFilterTag[]) {
    //   const tagIds = tags.map(t => t.id);
    //   this.mxFilterTagId.results = tagIds;
    // }
    // mxFilterTagId: SpMultiLookup;
}

@Injectable({ providedIn: AagtDataModule })
export class ActionItemMetadata extends ebase.MetadataBase<ActionItem> {
    metadataFor = ActionItem;

    constructor () {
        super(aagtCfg.AagtListName.ActionItem);
        this.entityDefinition.dataProperties.action = { dataType: this.dt.String };
        this.entityDefinition.dataProperties.shortCode = {
            dataType: this.dt.String
        };
        this.entityDefinition.dataProperties.teamType = {
            dataType: this.dt.String
        };
        this.entityDefinition.dataProperties.duration = { dataType: this.dt.Int16 };
        this.entityDefinition.dataProperties.availableForUse = { dataType: this.dt.Boolean };

        this.entityDefinition.navigationProperties = {
            actionTriggers: {
                entityTypeName: 'TriggerAction',
                associationName: 'Action_Trigger',
                isScalar: false
            }
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
