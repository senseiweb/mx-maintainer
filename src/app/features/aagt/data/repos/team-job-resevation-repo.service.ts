import { Injectable } from '@angular/core';
import { BaseRepoService } from 'app/global-data';
import { AagtDataModule } from '../aagt-data.module';
import { AagtEmProviderService } from '../aagt-emprovider.service';
import { TeamJobReservation } from '../models/team-job-reservation';

@Injectable({ providedIn: AagtDataModule })
export class TeamJobReservationRepoService extends BaseRepoService<
    TeamJobReservation
> {
    constructor(emService: AagtEmProviderService) {
        super('TeamJobReservation', emService);
    }
}
