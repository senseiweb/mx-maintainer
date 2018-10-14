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
  private bareAssetEntity: bareEntity<Asset>[] = [];
  constructor() {
    this.stateNames.forEach((state, i) => {
      const entity = {} as bareEntity<Asset>;
      entity.id = i + 1;
      entity.alias = state;
      entity.health = <string>faker.random.arrayElement(['FMC', 'PMC', 'NMC']);
      entity.authorId = faker.random.number({ min: 1, max: 10 });
      entity.editorId = faker.random.number({ min: 1, max: 10 });
      entity.created = faker.date.past(2018);
      entity.modified = faker.date.past(2018);
      this.bareAssetEntity.push(entity);
    });
  }

  get entities(): any {
    return this.bareAssetEntity;
  }
}
