import { Injectable } from '@angular/core';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { AagtListName } from '../models';
import { TeamCategory } from '../models/team-category';

@Injectable({ providedIn: AagtDataModule })
export class TeamCategoryRepoService extends BaseRepoService<TeamCategory> {
    constructor(emService: AagtEmProviderService) {
        super(AagtListName.TeamCategory, emService);
    }

    create(): TeamCategory {
        return this.createBase();
    }
}
