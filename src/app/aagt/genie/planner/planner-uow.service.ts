import { Injectable } from '@angular/core';
import {
    EntityManager,
    EntityType,
    EntityQuery,
    FilterQueryOp,
    Predicate,
    FilterQueryOpSymbol,
    FetchStrategySymbol,
    FetchStrategy,
} from 'breeze-client';
import { TriggerRepoService, SpAagtRepoService, ActionItem, ActionItemRepo, Trigger } from '../../data';
import {
    Asset,
    AssetRepoService,
    GenAssetRepoService,
    Generation,
    GenerationAsset,
    GenerationRepoService
} from '../../data';

import {
    ActivatedRouteSnapshot,
    Resolve,
    RouterStateSnapshot
} from '@angular/router';

import { AagtDataModule } from 'app/aagt/data/aagt-data.module';

@Injectable({ providedIn: AagtDataModule })
export class PlannerUowService implements Resolve<any> {
    allGenerations: Generation[];
    isoLookups: string[];
    allAssets: Asset[];
    allActionItems: ActionItem[];

    constructor(
        private genRepo: GenerationRepoService,
        private triggerRepo: TriggerRepoService,
        private assetRepo: AssetRepoService,
        private genAssetRepo: GenAssetRepoService,
        private spRepo: SpAagtRepoService,
        private actionItemRepo: ActionItemRepo
    ) { }

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Promise<any> {
        console.log('hit the resolver');
        return new Promise((resolve, reject) => {
            const generations = this.genRepo.all().then(data => this.allGenerations = data);
            const assets = this.assetRepo.all().then(data => this.allAssets = data);
            const ai = this.actionItemRepo.all().then(data => this.allActionItems = data);
            const isoLookups = this.spRepo.getIsoLookup().then((data) => this.isoLookups = data);
            return Promise.all([generations, assets, isoLookups, ai]).then(resolve, reject);
        });
    }

    newTrigger(generationId: number): Trigger  {
        return this.triggerRepo.newTrigger(generationId);
    }

    planGen(genId: number | string): Generation {
        if (genId !== 'new') {
            const genPredicate = Predicate.create(
                'id',
                FilterQueryOp.Equals,
                genId
            );
            const triggerPredicate = Predicate.create(
                'id',
                FilterQueryOp.Equals,
                genId
            );
            this.triggerRepo.where(triggerPredicate);
            return this.genRepo.whereInCache(genPredicate)[0];
        }
        return this.genRepo.createDraftGen();
    }

    getAssignedAssets(genId: number): Promise<GenerationAsset[]> {
        const genAssetPredicate = Predicate.create(
            'generationId',
            FilterQueryOp.Equals,
            genId
        );
        return this.genAssetRepo.where(genAssetPredicate);
    }
}
