import { bareEntity } from 'app/data';
import { Generation } from 'app/aagt/data';
import * as faker from 'faker';

export class GenerationFakeDb {
    static dbKey = 'Generation';
    private bareGenerationEntity: bareEntity<Generation>[] = [];
    constructor() {
        for (let index = 0; index < 7; index++) {
            const entity = {} as bareEntity<Generation>;
            const itemGuid = faker.random.uuid();
            entity.id = index + 1;
            entity.iD = index + 1 as any;
            entity.active = faker.random.boolean();
            entity.iso = faker.lorem.words(1);
            entity.status = <any>faker.random.arrayElement(['Draft', 'Planned', 'Active', 'Historical']);
            entity.numberAssetsRequired = faker.random.number({ min: 0, max: 10 });
            entity.title = faker.lorem.words(2);
            entity.startDateTime = faker.date.future(2018);
            entity.stopDateTime = faker.date.future(2018);
            entity.authorId = faker.random.number({ min: 1, max: 10 });
            entity.editorId = faker.random.number({ min: 1, max: 10 });
            entity.created = faker.date.past(2018);
            entity.modified = faker.date.past(2018);
            for (const prop in entity) {
                if (entity.hasOwnProperty(prop)) {
                    const newKey = prop.charAt(0).toUpperCase() + prop.substring(1);
                    delete Object.assign(entity, { [newKey]: entity[prop] })[prop];
                }
            }
            entity.__metadata = {
                etag: `'${index}'`,
                id: `Web/Lists(guid'${itemGuid}')/Items(${index})`,
                type: 'SP.Data.GenerationListItem',
                uri: `https://cs2.eis.af.mil/sites/10918/mx-maintainer/_api/Web/Lists(guid'${itemGuid}')/Items(${index})`
            };

            this.bareGenerationEntity.push(entity);
        }
    }

    get entities(): any {
        return this.bareGenerationEntity;
    }
}
