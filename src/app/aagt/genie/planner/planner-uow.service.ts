import { Injectable } from '@angular/core';
import * as breeze from 'breeze-client';
import { TriggerRepoService, SpAagtRepoService } from '../../data';
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

    constructor(
        private genRepo: GenerationRepoService,
        private triggerRepo: TriggerRepoService,
        private assetRepo: AssetRepoService,
        private genAssetRepo: GenAssetRepoService,
        private spRepo: SpAagtRepoService
    ) { }

    resolve(
        _route: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ): Promise<any> {
        console.log('hit the resolver');
        return new Promise((resolve, reject) => {
            const generations = this.genRepo.all().then(data => this.allGenerations = data);
            const assets = this.assetRepo.all().then(data => this.allAssets = data);
            const isoLookups = this.spRepo.getIsoLookup().then((data) => this.isoLookups = data);
            return Promise.all([generations, assets, isoLookups]).then(resolve, reject);
        });
    }

    planGen(genId: number | string): Generation {
        if (genId !== 'new') {
            const genPredicate = breeze.Predicate.create(
                'id',
                breeze.FilterQueryOp.Equals,
                genId
            );
            const triggerPredicate = breeze.Predicate.create(
                'id',
                breeze.FilterQueryOp.Equals,
                genId
            );
            this.triggerRepo.where(triggerPredicate);
            return this.genRepo.whereInCache(genPredicate)[0];
        }
        return this.genRepo.createDraftGen();
    }

    getAssignedAssets(genId: number): Promise<GenerationAsset[]> {
        const genAssetPredicate = breeze.Predicate.create(
            'generationId',
            breeze.FilterQueryOp.Equals,
            genId
        );
        return this.genAssetRepo.where(genAssetPredicate);
    }
}
