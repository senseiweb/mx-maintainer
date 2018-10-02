import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { GeneratorOps } from '../entities';

@Injectable()
export class GenerationRepoService extends BaseRepoService<GeneratorOps> {

  constructor(private _genOps: GeneratorOps) {
    super(_genOps);
  }

}
