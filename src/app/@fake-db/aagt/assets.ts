import { bareEntity } from 'app/data';
import * as faker from 'faker';
import { Asset } from 'app/aagt/data';

export class AssetsFakeDb {
    static dbKey = 'Asset';
    private stateNames = ['Alabama',
        'Alaska',
        'Arizona',
        'Arkansas',
        'California',
        'Colorado',
        'Connecticut',
        'Delaware',
        'Florida',
        'Georgia',
        'Hawaii',
        'Idaho',
        'Illinois',
        'Indiana',
        'Iowa',
        'Kansas',
        'Kentucky',
        'Louisiana',
        'Maine',
        'Maryland',
        'Massachusetts',
        'Michigan',
        'Minnesota',
        'Mississippi',
        'Missouri',
        'Montana',
        'Nebraska',
        'Nevada',
        'New Hampshire',
        'New Jersey',
        'New Mexico',
        'New York',
        'North Carolina',
        'North Dakota',
        'Ohio',
        'Oklahoma',
        'Oregon',
        'Pennsylvania',
        'Rhode Island',
        'South Carolina',
        'South Dakota',
        'Tennessee',
        'Texas',
        'Utah',
        'Vermont',
        'Virginia',
        'Washington',
        'West Virginia',
        'Wisconsin',
        'Wyoming'];
    private bareAssetEntity: bareEntity<Asset>[] = [];
    constructor() {
        this.stateNames.forEach((state, i) => {
            const itemGuid = faker.random.uuid();
            const entity = {} as bareEntity<Asset>;
            entity.id = i + 1;
            entity.iD = i + 1;
            entity.alias = state;
            entity.location = `Baker-${i}`;
            entity.authorId = faker.random.number({ min: 1, max: 10 });
            entity.editorId = faker.random.number({ min: 1, max: 10 });
            entity.created = faker.date.past(2018);
            entity.modified = faker.date.past(2018);
            entity.notes = '';
            for (const prop in entity) {
                if (entity.hasOwnProperty(prop)) {
                    const newKey = prop.charAt(0).toUpperCase() + prop.substring(1);
                    delete Object.assign(entity, { [newKey]: entity[prop] })[prop];
                }
            }
            entity.__metadata = {
                etag: `'${entity.id}'`,
                id: `Web/Lists(guid'${itemGuid}')/Items(${entity.id})`,
                type: 'SP.Data.AssetListItem',
                uri: `https://cs2.eis.af.mil/sites/10918/mx-maintainer/_api/Web/Lists(guid'${itemGuid}')/Items(${entity.id})`

            };
            this.bareAssetEntity.push(entity);
        });
    }

    get entities(): any {
        return this.bareAssetEntity;
    }
}
