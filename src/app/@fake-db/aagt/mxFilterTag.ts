import { bareEntity, MxFilterTag, MxAppEnum } from 'app/data';
import * as faker from 'faker';

export class MxFilterTagFakeDb {
  static dbKey = 'MxFilterTag';
  private bareGenerationEntity: bareEntity<MxFilterTag>[] = [];
  constructor() {
    for (let index = 0; index < 10; index++) {
      const entity = {} as bareEntity<MxFilterTag>;
      const itemGuid = faker.random.uuid();
      entity.id = index + 1;
      entity.iD = index + 1 as any;
      entity.tagHandle = `handle${index}`;
      entity.tagTitle = faker.lorem.words(1);
      entity.tagIcon = <any>faker.random.arrayElement(['announcement', 'class', 'change_history', 'dns', 'description', 'eject', 'face']);
      entity.isFilter = faker.random.boolean();
      entity.appReference = MxAppEnum.aagt;
      entity.authorId = faker.random.number({ min: 1, max: 10 });
      entity.editorId = faker.random.number({ min: 1, max: 10 });
      entity.created = faker.date.past(2018);
      entity.modified = faker.date.past(2018);
      entity.__metadata = {
        etag: `'${entity.id}'`,
        id: `Web/Lists(guid'${itemGuid}')/Items(${entity.id})`,
        type: 'SP.Data.GenerationListItem',
        // tslint:disable-next-line:max-line-length
        uri: `https://cs2.eis.af.mil/sites/10918/mx-maintainer/_api/Web/Lists(guid'${itemGuid}')/Items(${entity.id})`
      };

      this.bareGenerationEntity.push(entity);
    }
  }

  get entities(): any {
    return this.bareGenerationEntity;
  }
}
