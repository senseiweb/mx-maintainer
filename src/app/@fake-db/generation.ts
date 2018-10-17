import { Generation, bareEntity } from 'app/core';
import * as faker from 'faker';
import { FakeSpDb } from './_fake-db.service';

export class GenerationFakeDb implements FakeSpDb<Generation> {
  static dbKey = 'Generation';
  private bareGenerationEntity: bareEntity<Generation|any>[] = [];

  constructor() {
    for (let index = 0; index < 7; index++) {
      const entity = {} as bareEntity<Generation | any>;
      const itemGuid = faker.random.uuid();
      entity.Id = index + 1;
      entity.ID = index + 1;
      entity.Active = faker.random.boolean();
      entity.Iso = faker.lorem.words(1);
      entity.Status = <any>faker.random.arrayElement(['Draft', 'Planned', 'Active', 'Historical']);
      entity.NumberAssetsRequired = faker.random.number({ min: 0, max: 10 });
      entity.Title = faker.lorem.words(2);
      entity.StartDateTime = faker.date.future(2018);
      entity.StopDateTime = faker.date.future(2018);
      entity.AuthorId = faker.random.number({ min: 1, max: 10 });
      entity.EditorId = faker.random.number({ min: 1, max: 10 });
      entity.Created = faker.date.past(2018);
      entity.Modified = faker.date.past(2018);
      entity.__metadata = {
        etag: `'${entity.Id}'`,
        id: `Web/Lists(guid'${itemGuid}')/Items(${entity.Id})`,
        type: 'SP.Data.GenerationListItem',
        // tslint:disable-next-line:max-line-length
        uri: `https://cs2.eis.af.mil/sites/12042/wing/5bw/5mxg/5mos/programs/codi/_api/Web/Lists(guid'${itemGuid}')/Items(${entity.Id})`
      };
      this.bareGenerationEntity.push(entity);
    }
  }

  get entities(): any {
    return this.bareGenerationEntity;
  }
}
