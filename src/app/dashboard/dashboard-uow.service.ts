import { Injectable, OnInit } from '@angular/core';
import { GenerationRepoService, Generation, Asset } from '../core';
import { TriggerRepoService } from '../core/data/trigger-repo.service';
import * as breeze from 'breeze-client';
import { AssetRepoService } from 'app/core/data/asset-repo.service';
import { all } from 'q';
import { GenAssetRepoService } from 'app/core/data/gen-asset-repo.service';
import { GenerationAsset } from 'app/core/entities/generation-asset';

@Injectable()
export class DashboardUowService {

  allGenerations: Array<Generation>;
  allAssets: Array<Asset>;

  constructor(private genRepo: GenerationRepoService,
    private triggerRepo: TriggerRepoService,
    private assetRepo: AssetRepoService,
    private genAssetRepo: GenAssetRepoService
  ) {
    this.init();
  }

  init(): void {
    this.genRepo.all()
      .then(generations => this.allGenerations = generations);
  }

  planGen(genId?: number): Generation {
    if (genId) {
      const genPredicate = breeze.Predicate.create('id', breeze.FilterQueryOp.Equals, genId);
      const triggerPredicate = breeze.Predicate.create('id', breeze.FilterQueryOp.Equals, genId);
      this.triggerRepo.where(triggerPredicate);
      this.getAllAssets();
      return this.genRepo.whereInCache(genPredicate)[0];
    }
    return this.genRepo.createDraftGen();
  }

  getAllAssets(): void {
    this.assetRepo.all().then(assets => this.allAssets = assets);
  }

  getAssignedAssets(genId: number): Promise<Array<GenerationAsset>> {
    const genAssetPredicate = breeze.Predicate.create('generationId', breeze.FilterQueryOp.Equals, genId);
    return this.genAssetRepo.where(genAssetPredicate);
  }
}
