import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService, SpDataRepoService, MxAppEnum } from 'app/data';
import { MxFilterTag } from 'app/data';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class TagRepoService extends BaseRepoService<MxFilterTag> {

  private gotTags = false;
  constructor(entityService: EmProviderService,
        private spData: SpDataRepoService) {
    super('MxFilterTag', entityService);
  }

  async fetchTags(): Promise<Array<MxFilterTag>> {
    if (this.gotTags) {
      return Promise.resolve(this.entityManager.getEntities(this.entityType.shortName) as Array<MxFilterTag>);
    }
    try {
      const tags = await this.spData.fetchAppTags(MxAppEnum.aagt);
      this.gotTags = true;
      tags.forEach(tag => {
        this.entityManager.createEntity(this.entityType.shortName, tag, breeze.EntityState.Unchanged);
      });
      return Promise.resolve(this.entityManager.getEntities(this.entityType.shortName) as Array<MxFilterTag>);
    } catch (e) {
      this.queryFailed(e);
    }
  }
}
