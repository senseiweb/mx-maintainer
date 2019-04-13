import { Injectable } from '@angular/core';
import { BaseRepoService, CoreEmProviderService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { AagtListName, Team } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TeamRepoService extends BaseRepoService<Team> {
    constructor(emService: AagtEmProviderService) {
        super(AagtListName.Team, emService);
    }

    create(): Team {
        return this.createBase();
    }
}
