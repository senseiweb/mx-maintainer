import { Asset, bareEntity } from 'app/core';
import * as faker from 'faker';
import { FakeSpDb } from './_fake-db.service';

export class AssetsFakeDb implements FakeSpDb<Asset>  {
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
  private bareAssetEntity: bareEntity<any>[] = [];
  constructor() {
    this.stateNames.forEach((state, i) => {
      const itemGuid = faker.random.uuid();
      const entity = {} as bareEntity<any>;
      entity.Id = i + 1;
      entity.ID = i + 1;
      entity.Alias = state;
      entity.AuthorId = faker.random.number({ min: 1, max: 10 });
      entity.EditorId = faker.random.number({ min: 1, max: 10 });
      entity.Created = faker.date.past(2018);
      entity.Modified = faker.date.past(2018);
      entity.Notes = '';
      entity.__metadata = {
        etag: entity.Id,
        id: `Web/Lists(guid'${itemGuid}')/Items(${entity.Id})`,
        type: 'SP.Data.AssetListItem',
        // tslint:disable-next-line:max-line-length
        uri: `https://cs2.eis.af.mil/sites/12042/wing/5bw/5mxg/5mos/programs/codi/_api/Web/Lists(guid'${itemGuid}')/Items(${entity.Id})`

      };
      this.bareAssetEntity.push(entity);
    });
  }

  get entities(): any {
    return this.bareAssetEntity;
  }
}
