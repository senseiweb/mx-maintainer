import { Injectable } from '@angular/core';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { SpListName } from 'app/app-config.service';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { TeamCategory } from '../models/team-category';

@Injectable({ providedIn: AagtDataModule })
export class TeamCategoryRepoService extends BaseRepoService<TeamCategory> {
    constructor(emService: AagtEmProviderService) {
        super(SpListName.TeamCategory, emService);
    }

    private getRandomColor(): string {
        const letters = '0123456789ABCDEF'.split('');
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    create(): TeamCategory {
        const defaultProps: bareEntity<TeamCategory> = {};
        defaultProps.teamCatColor = this.getRandomColor();
        return this.createBase(defaultProps);
    }

    hasChanges(): boolean {
        return this.entityManager.hasChanges(this.entityType);
    }
}
