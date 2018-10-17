import { SpConfigData, bareEntity, SpCfgIsoType, configKeyEnum } from 'app/core';
import * as faker from 'faker';
import { FakeSpDb } from './_fake-db.service';

export class SpConfigDataFakeDb implements FakeSpDb<SpConfigData> {
  static dbKey = 'SpConfigData';
  private bareSpCfgDataEntity: bareEntity<SpConfigData>[] = [];

  constructor() {
    const isoTypeEntity = {} as any;
    const isoTypeItemGuid = faker.random.uuid();
    isoTypeEntity.Title = configKeyEnum.isoTypes;
    isoTypeEntity.ConfigValue = ['Hetic Roller', 'Global Thunder', 'World of Waldo'];
    isoTypeEntity.Id = 1;
    isoTypeEntity.ID = 1;
    isoTypeEntity.__metadata = {
      etag: isoTypeEntity.Id,
      id: `Web/Lists(guid'${isoTypeItemGuid}')/Items(${isoTypeEntity.Id})`,
      type: 'SP.Data.SpConfigDataListItem',
      // tslint:disable-next-line:max-line-length
      uri: `https://cs2.eis.af.mil/sites/12042/wing/5bw/5mxg/5mos/programs/codi/_api/Web/Lists(guid'${isoTypeItemGuid}')/Items(${isoTypeEntity.Id})`

    };
    this.bareSpCfgDataEntity.push(isoTypeEntity);
  }

  get entities(): any {
    return this.bareSpCfgDataEntity;
  }
}
