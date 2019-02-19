import { GenerationAsset } from 'app/aagt/data';
import { bareEntity } from 'app/data';
import * as faker from 'faker';

export class GenAssetFakeDb {
    static dbKey = 'GenerationAsset';
    private bareGenerationEntity: Array<bareEntity<GenerationAsset>> = [];
    constructor() {
        for (let index = 0; index < 17; index++) {
            const entity = {} as bareEntity<GenerationAsset>;
            const itemGuid = faker.random.uuid();
            entity.id = index + 1;
            entity.iD = index + 1 as any;
            entity.health = faker.random.arrayElement(['FMC', 'PMC', 'NMC']) as any;
            entity.title = faker.random.word();
            entity.mxPosition = faker.random.number();
            entity.assetId = faker.random.number(50);
            entity.generationId = faker.random.number(25);
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
                etag: `'${entity.id}'`,
                id: `Web/Lists(guid'${itemGuid}')/Items(${entity.id})`,
                type: 'SP.Data.GenerationAssetListItem',
                uri: `https://cs2.eis.af.mil/sites/10918/mx-maintainer/_api/Web/Lists(guid'${itemGuid}')/Items(${entity.id})`
            };
            this.bareGenerationEntity.push(entity);
        }
    }

    get entities(): any {
        return this.bareGenerationEntity;
    }
}
