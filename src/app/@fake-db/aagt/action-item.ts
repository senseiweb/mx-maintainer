import { ActionItem } from 'app/aagt/data';
import { bareEntity } from 'app/data';
import * as faker from 'faker';

export class ActionItemFakeDb {
    static dbKey = 'ActionItem';
    private bareGenerationEntity: Array<bareEntity<ActionItem>> = [];
    constructor() {
        for (let index = 0; index < 17; index++) {
            const entity = {} as bareEntity<ActionItem>;
            const itemGuid = faker.random.uuid();
            entity.id = index + 1;
            entity.iD = index + 1 as any;
            entity.availableForUse = faker.random.boolean();
            entity.action = faker.random.arrayElement(['Load Wing', 'Load Center', 'Cock On', 'Tow', 'ReCock', 'Fuel', 'Nutrion']) as any;
            entity.shortCode = faker.lorem.words(1);

            // entity.status = faker.random.arrayElement(['Delayed', 'OnTime', 'Scheduled', 'Planned',
            // 'Done']) as any;
            entity.duration = faker.random.number({ min: 0, max: 400 });
            entity.teamType = faker.random.arrayElement(['EW', 'Load Team', 'Tow Team', 'Specialist-Com/Nav']);
            //  entity.mxFilterTagId = {
            //    results: [],
            //    __metadata: {
            //      id: `Web/Lists(guid'${itemGuid}')/Items(${entity.id})`,
            //      type: 'SP.Data.ActionItemListItem'
            //    },
            //  };
            entity.authorId = faker.random.number({ min: 1, max: 10 });
            entity.editorId = faker.random.number({ min: 1, max: 10 });
            entity.created = faker.date.past(2018);
            entity.modified = faker.date.past(2018);


            // const numOfTags = faker.random.number({ min: 1, max: 5 });

            //  for (let t = 0; t <= numOfTags; t++) {
            //    const tagId = faker.random.number({ min: 1, max: 10 });
            //    entity.mxFilterTagId.results.push(tagId);
            //  }

            for (const prop in entity) {
                if (entity.hasOwnProperty(prop)) {
                    const newKey = prop.charAt(0).toUpperCase() + prop.substring(1);
                    delete Object.assign(entity, { [newKey]: entity[prop] })[prop];
                }
            }

            entity.__metadata = {
                etag: `'${entity.id}'`,
                id: `Web/Lists(guid'${itemGuid}')/Items(${entity.id})`,
                type: 'SP.Data.ActionItemListItem',
                uri: `https://cs2.eis.af.mil/sites/10918/mx-maintainer/_api/Web/Lists(guid'${itemGuid}')/Items(${entity.id})`
            };
            this.bareGenerationEntity.push(entity);
        }
    }

    get entities(): any {
        return this.bareGenerationEntity;
    }
}
