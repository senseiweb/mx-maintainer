import { Injectable, OnInit } from '@angular/core';
import { TriggerRepoService } from '../data';
import * as breeze from 'breeze-client';
import {
  GenerationRepoService,
  Generation,
  GenerationAsset,
  Asset,
  GenAssetRepoService,
  AssetRepoService
} from '../data';

import {
  Router, Resolve,
  RouterStateSnapshot,
  ActivatedRouteSnapshot,
} from '@angular/router';

@Injectable()
export class GenieUowService implements Resolve<any> {

  allGenerations: Array<Generation>;

  constructor(private genRepo: GenerationRepoService,
    private triggerRepo: TriggerRepoService,
    private assetRepo: AssetRepoService,
    private genAssetRepo: GenAssetRepoService
  ) {
  }

  resolve(route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ): Promise<any> {
    console.log('hit the resolver');
    return new Promise((resolve, reject) => {
      const generations = this.genRepo.all();
      const assets = this.assetRepo.all();
      return Promise.all([generations, assets]).then(() => { resolve(); }, reject);
    });
  }

  planGen(genId?: number): Generation {
    if (genId !== 0) {
      const genPredicate = breeze.Predicate.create('id', breeze.FilterQueryOp.Equals, genId);
      const triggerPredicate = breeze.Predicate.create('id', breeze.FilterQueryOp.Equals, genId);
      this.triggerRepo.where(triggerPredicate);
      this.getAllAssets();
      return this.genRepo.whereInCache(genPredicate)[0];
    }
    return this.genRepo.createDraftGen();
  }

  async getAllAssets(): Promise<Array<Asset>> {
    const data = await this.assetRepo.all();
    // tslint:disable-next-line:no-console
    console.info(`return this info for getAllAssets==> ${data}`);
    return Promise.resolve(data);
  }

  getAssignedAssets(genId: number): Promise<Array<GenerationAsset>> {
    const genAssetPredicate = breeze.Predicate.create('generationId', breeze.FilterQueryOp.Equals, genId);
    return this.genAssetRepo.where(genAssetPredicate);
  }
}
