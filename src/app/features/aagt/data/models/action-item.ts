import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';

import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_IsRequired,
    SpEntityBase
} from 'app/global-data';
import { DataType } from 'breeze-client';
import { AagtDataModule } from '../aagt-data.module';
import { TeamCategory } from './team-category';
import { TriggerAction } from './trigger-action';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.ActionItem })
export class ActionItem extends SpEntityBase {
    @BzDataProp({
        isNullable: false,
        spInternalName: 'Title'
    })
    action: string;

    @BzDataProp()
    @BzValid_IsRequired
    shortCode: string;

    @BzDataProp()
    duration: number;

    @BzDataProp()
    @BzValid_IsRequired
    teamCategoryId: number;

    @BzNavProp<ActionItem>({ rt: 'TeamCategory', fk: 'teamCategoryId' })
    teamCategory: TeamCategory;

    @BzDataProp()
    assignable: boolean;

    @BzDataProp()
    notes: string;

    @BzNavProp({ rt: 'TriggerAction' })
    actionTriggers: TriggerAction[];
}

// @Injectable({ providedIn: AagtDataModule })
// export class ActionItemMetadata extends ebase.MetadataBase<ActionItem> {
//     metadataFor = ActionItem;

//     constructor() {
//         super(SpListName.ActionItem);
//         this.entityDefinition.dataProperties.action = {
//             isNullable: false,
//             dataType: this.dt.String,
//             spInternalName: 'Title'
//         };
//         this.entityDefinition.dataProperties.shortCode = {
//             isNullable: false,
//             dataType: this.dt.String
//         };
//         this.entityDefinition.dataProperties.teamCategoryId = {
//             dataType: this.dt.Int16,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.duration = {
//             dataType: this.dt.Int16
//         };
//         this.entityDefinition.dataProperties.assignable = {
//             dataType: this.dt.Boolean
//         };

//         this.entityDefinition.navigationProperties = {
//             actionTriggers: {
//                 entityTypeName: 'TriggerAction',
//                 associationName: 'Action_Trigger',
//                 isScalar: false
//             },
//             teamCategory: {
//                 entityTypeName: SpListName.TeamCategory,
//                 associationName: 'TeamCategory_Teams',
//                 foreignKeyNames: ['teamCategoryId']
//             }
//         };

//         Object.assign(
//             this.entityDefinition.dataProperties,
//             this.baseDataProperties
//         );
//     }
// }
