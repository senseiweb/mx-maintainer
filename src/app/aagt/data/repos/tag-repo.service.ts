import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService, SpDataRepoService, MxAppEnum } from 'app/data';
import { MxFilterTag, MxmTagMetadata } from 'app/data';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class TagRepoService extends BaseRepoService<MxFilterTag> {

  private gotTags = false;
  constructor(entityService: EmProviderService,
    tagsMeta: MxmTagMetadata,
    private spData: SpDataRepoService) {
    super(tagsMeta, entityService);
  }

  async fetchTags(): Promise<Array<MxFilterTag>> {
    if (this.gotTags) {
      return Promise.resolve(this.entityManager.getEntities(this.entityTypeName) as Array<MxFilterTag>);
    }
    try {
      const tags = await this.spData.fetchAppTags(MxAppEnum.aagt);
      this.gotTags = true;
      tags.forEach(tag => {
        this.entityManager.createEntity(this.entityTypeName, tag, breeze.EntityState.Unchanged);
      });
      return Promise.resolve(this.entityManager.getEntities(this.entityTypeName) as Array<MxFilterTag>);
    } catch (e) {
      this.queryFailed(e);
    }
  }
}
