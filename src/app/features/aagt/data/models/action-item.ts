import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import * as aagtCfg from './_aagt-feature-cfg';
import { AagtDataModule } from '../aagt-data.module';
import { TriggerAction } from './trigger-action';
export class ActionItem extends ebase.SpEntityBase {
    action: string;
    shortCode: string;
    duration: number;
    teamType: string;
    // Sharepoint handle yes/no boxes as 0:1 values to represet boolean;
    assignable: boolean;
    notes: string;
    actionTriggers: TriggerAction[];
}

@Injectable({ providedIn: AagtDataModule })
export class ActionItemMetadata extends ebase.MetadataBase<ActionItem> {
    metadataFor = ActionItem;

    constructor() {
        super(aagtCfg.AagtListName.ActionItem);
        this.entityDefinition.dataProperties.action = {
            dataType: this.dt.String,
            spInternalName: 'Title'
        };
        this.entityDefinition.dataProperties.shortCode = {
            dataType: this.dt.String
        };
        this.entityDefinition.dataProperties.teamType = {
            dataType: this.dt.String
        };
        this.entityDefinition.dataProperties.duration = { dataType: this.dt.Int16 };
        this.entityDefinition.dataProperties.assignable = { dataType: this.dt.Boolean };

        this.entityDefinition.navigationProperties = {
            actionTriggers: {
                entityTypeName: 'TriggerAction',
                associationName: 'Action_Trigger',
                isScalar: false
            }
        };

        Object.assign(this.entityDefinition.dataProperties, this.baseDataProperties);
    }
}
