import { Injectable } from '@angular/core';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { TeamAvailability } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TeamAvailRepoService extends BaseRepoService<TeamAvailability> {
    constructor(emService: AagtEmProviderService) {
        super('TeamAvailability', emService);
    }

    create(availInfo: {
        teamId: number;
        availStart: Date;
        availEnd: Date;
    }): TeamAvailability {
        return this.createBase(availInfo);
    }
}
