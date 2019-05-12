import { Injectable } from '@angular/core';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { Team, TeamCategory } from '../models';

@Injectable({ providedIn: AagtDataModule })
export class TeamRepoService extends BaseRepoService<Team> {
    constructor(emService: AagtEmProviderService) {
        super('Team', emService);
    }

    create(): Team {
        return this.createBase();
    }
}
