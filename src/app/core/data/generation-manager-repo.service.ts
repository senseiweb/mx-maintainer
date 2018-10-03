import { Injectable } from '@angular/core';
import { BaseRepoService } from './base-repository.service';
import { GeneratorOps } from '../entities';
import { EmProviderService } from './em-provider';


@Injectable()
export class GenerationRepoService extends BaseRepoService<GeneratorOps> {

  constructor(genOps: GeneratorOps, entityService: EmProviderService) {
    super(genOps, entityService );
  }

}
