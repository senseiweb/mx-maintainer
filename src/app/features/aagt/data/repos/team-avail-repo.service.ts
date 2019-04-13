import { Injectable } from '@angular/core';
import { BaseRepoService, CoreEmProviderService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { AagtListName, TeamAvailability } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TeamAvailRepoService extends BaseRepoService<TeamAvailability> {
    constructor(emService: AagtEmProviderService) {
        super(AagtListName.TeamAvail, emService);
    }

    create(): TeamAvailability {
        return this.createBase();
    }
}
