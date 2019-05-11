import { Injectable } from '@angular/core';
import { RawEntity } from '@ctypes/breeze-type-customization';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { TeamCategory } from '../models/team-category';

@Injectable({ providedIn: AagtDataModule })
export class TeamCategoryRepoService extends BaseRepoService<'TeamCategory'> {
    constructor(emService: AagtEmProviderService) {
        super('TeamCategory', emService);
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
        const defaultProps: RawEntity<TeamCategory> = {};
        defaultProps.teamCatColor = this.getRandomColor();
        return this.createBase(defaultProps);
    }

    hasChanges(): boolean {
        return this.entityManager.hasChanges(this.entityType);
    }
}
