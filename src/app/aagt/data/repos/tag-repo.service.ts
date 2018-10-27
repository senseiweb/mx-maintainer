import { Injectable } from '@angular/core';
import { BaseRepoService, EmProviderService, SpDataRepoService, MxAppEnum } from 'app/data';
import { MxmTag, MxmTagMetadata } from 'app/data';
import { AagtModule } from 'app/aagt/aagt.module';

@Injectable({
  providedIn: AagtModule
})
export class TagsRepoService extends BaseRepoService<MxmTag> {

  private gotTags = false;
  constructor(entityService: EmProviderService,
    tagsMeta: MxmTagMetadata,
    private spData: SpDataRepoService) {
    super(tagsMeta, entityService);
  }

  async fetchTags(): Promise<Array<MxmTag>> {
    if (this.gotTags) {
      return Promise.resolve(this.entityManager.getEntities(this.entityTypeName) as Array<MxmTag>);
    }
    try {
      const tags = await this.spData.fetchAppTags(MxAppEnum.aagt);
      this.gotTags = true;
      tags.forEach(tag => {
        this.entityManager.createEntity(this.entityTypeName, tag, breeze.EntityState.Unchanged);
      });
      return Promise.resolve(this.entityManager.getEntities(this.entityTypeName) as Array<MxmTag>);
    } catch (e) {
      this.queryFailed(e);
    }
  }
}
