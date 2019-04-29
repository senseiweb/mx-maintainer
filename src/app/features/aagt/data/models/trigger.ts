import { MxmAppName, SpListName } from 'app/app-config.service';
import * as ebase from 'app/global-data';
import {
    BzDataProp,
    BzEntity,
    BzNavProp,
    BzValid_CustomValidator
} from 'app/global-data/models/_entity-decorators';
import { Validator } from 'breeze-client';
import * as _m from 'moment';
import { Generation } from './generation';
import { TriggerAction } from './trigger-action';

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.Trigger })
export class Trigger extends ebase.SpEntityBase {
    @BzDataProp({
        spInternalName: 'Title'
    })
    milestone: string;

    get completionTime(): number {
        if (!this.triggerActions) {
            return;
        }
        return this.triggerActions
            .map(tra => tra.actionItem.duration)
            .reduce((duration1, duration2) => duration1 + duration2, 0);
    }

    @BzDataProp()
    triggerStart?: Date;

    @BzDataProp()
    triggerStop?: Date;

    @BzDataProp()
    triggerDateRange: Date[];

    @BzDataProp()
    generationId: number;

    @BzNavProp<Trigger>('generationId')
    generation: Generation;

    @BzNavProp()
    triggerActions: TriggerAction[];

    @BzValid_CustomValidator<Trigger>()
    validateTrigger(): Validator {
        return new Validator('duplicateTriggerMiles', (entity: this, ctx) => {
            if (!entity || !entity.milestone) {
                return true;
            }
            const existing = entity.generation.triggers.map(trig => {
                if (trig.milestone && trig.milestone) {
                    return trig.milestone;
                }
            });
            if (!existing) {
                return true;
            }
            if (existing.includes(entity.milestone)) {
                return false;
            }
            return true;
        });
    }
}

// @Injectable({
//     providedIn: AagtDataModule
// })
// export class TriggerMetadata extends ebase.MetadataBase<Trigger> {
//     metadataFor = Trigger;

//     constructor() {
//         super(SpListName.Trigger);
//         this.entityDefinition.dataProperties.milestone = {
//             dataType: this.dt.String,
//             spInternalName: 'Title'
//         };
//         this.entityDefinition.dataProperties.triggerStart = {
//             dataType: this.dt.DateTime
//         };
//         this.entityDefinition.dataProperties.triggerStop = {
//             dataType: this.dt.DateTime
//         };
//         this.entityDefinition.dataProperties.generationId = {
//             dataType: this.dt.Int32,
//             isNullable: false
//         };

//         this.entityDefinition.navigationProperties = {
//             generation: {
//                 entityTypeName: SpListName.Generation,
//                 associationName: 'Generation_Triggers',
//                 foreignKeyNames: ['generationId']
//             },
//             triggerActions: {
//                 entityTypeName: SpListName.TriggerAction,
//                 associationName: 'Trigger_Action',
//                 isScalar: false
//             }
//         };

//         Object.assign(
//             this.entityDefinition.dataProperties,
//             this.baseDataProperties
//         );

//         this.createEntityValidator('duplicateTriggerMiles', (entity, ctx) => {
//             if (!entity || !entity.milestone) {
//                 return true;
//             }
//             const existing = entity.generation.triggers.map(trig => {
//                 if (trig.milestone && trig.milestone) {
//                     return trig.milestone;
//                 }
//             });
//             if (!existing) {
//                 return true;
//             }
//             if (existing.includes(entity.milestone)) {
//                 return false;
//             }
//             return true;
//         });

//         this.initializer = _entity => {
//             // _entity.draftActionItems = new Map();
//             // _entity.triggerActions.forEach(tra =>
//             //     _entity.draftActionItems.set(tra.actionItemId, {
//             //         sequence: tra.sequence,
//             //         actionItem: tra.actionItem
//             //     })
//             // );
//         };
//     }
// }
