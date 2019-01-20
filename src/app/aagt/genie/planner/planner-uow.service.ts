import { Injectable } from '@angular/core';
import {
    FilterQueryOp,
    Predicate
} from 'breeze-client';
import {
    TriggerRepoService,
    SpAagtRepoService,
    ActionItem,
    ActionItemRepo,
    Trigger,
    TriggerAction
} from '../../data';
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
import { TriggerActionRepoService } from 'app/aagt/data/repos/trigger-action-repo.service';

@Injectable({ providedIn: AagtDataModule })
export class PlannerUowService implements Resolve<any> {
    allGenerations: Generation[];
    isoLookups: string[];
    allAssets: Asset[];
    allActionItems: ActionItem[];

    constructor(
        private genRepo: GenerationRepoService,
        private triggerRepo: TriggerRepoService,
        private triggerActionRepo: TriggerActionRepoService,
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

    getOrCreateGenerationAsset(data: { generationId: number, assetId: number }): GenerationAsset {
        return this.genAssetRepo.getOrCreateGenerationAsset(data);
    }

    getOrCreateTriggerAction(data: { triggerId: number, actionItemId: number }): TriggerAction {
        return this.triggerActionRepo.getOrCreateTriggerAction(data);
    }

    newTrigger(generationId: number): Trigger {
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
