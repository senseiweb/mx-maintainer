import { Injectable, OnInit } from '@angular/core';
import { GenerationRepoService, Generation } from '../core';
import { TriggerRepoService } from '../core/data/trigger-repo.service';
import * as breeze from 'breeze-client';

@Injectable()
export class GenieUowService implements OnInit {

  allGenerations: Array<Generation>;

  constructor(private _genRepo: GenerationRepoService,
              private _triggerRepo: TriggerRepoService) {
  }

  ngOnInit(): void {
    this._genRepo.all()
      .then(generations => this.allGenerations = generations);
  }

  planGen(genId?: number): Generation {
    if (genId) {
      const genPredicate = breeze.Predicate.create('id', breeze.FilterQueryOp.Equals, genId);
      const triggerPredicate = breeze.Predicate.create('id', breeze.FilterQueryOp.Equals, genId);
      this._triggerRepo.where(triggerPredicate);
      return this._genRepo.whereInCache(genPredicate)[0];
    }
    return this._genRepo.createDraftGen();
  }
}
