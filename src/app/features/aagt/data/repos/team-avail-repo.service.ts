import { Injectable } from '@angular/core';
import { SpListName } from 'app/app-config.service';
import { BaseRepoService, CoreEmProviderService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { TeamAvailability } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TeamAvailRepoService extends BaseRepoService<TeamAvailability> {
    constructor(emService: AagtEmProviderService) {
        super(SpListName.TeamAvailability, emService);
    }

    create(availInfo: {
        teamId: number;
        availStart: Date;
        availEnd: Date;
    }): TeamAvailability {
        return this.createBase(availInfo);
    }
}
