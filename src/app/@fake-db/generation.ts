import { Generation, bareEntity } from 'app/core';
import * as faker from 'faker';
import { FakeSpDb } from './_fake-db.service';

export class GenerationFakeDb implements FakeSpDb<Generation> {
  static dbKey = 'Generation';
  private bareGenerationEntity: bareEntity<Generation>[] = [];

  constructor() {
    for (let index = 0; index < 7; index++) {
      const entity = {} as bareEntity<Generation>;
      entity.id = index + 1;
      entity.active = faker.random.boolean();
      entity.status = <any>faker.random.arrayElement(['Draft', 'Planned', 'Active', 'Historical']);
      entity.numberAssetsRequired = faker.random.number({ min: 0, max: 10 });
      entity.title = faker.lorem.words(2);
      entity.authorId = faker.random.number({ min: 1, max: 10 });
      entity.editorId = faker.random.number({ min: 1, max: 10 });
      entity.created = faker.date.past(2018);
      entity.modified = faker.date.past(2018);
      this.bareGenerationEntity.push(entity);
    }
  }

  get entities(): any {
    return JSON.stringify({ d: this.bareGenerationEntity });
  }
}
