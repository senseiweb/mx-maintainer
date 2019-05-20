import { DataSource } from '@angular/cdk/table';
import { MatPaginator, MatSort } from '@angular/material';
import { Team, TeamAvailability } from 'app/features/aagt/data';
import { EntityAction } from 'breeze-client';
import * as _l from 'lodash';
import { merge, BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, tap } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';

export class TeamAvailDataSource extends DataSource<TeamAvailability> {
    private dataSourceTeamAvailabitiy = this.planUow.aagtEmService
        .onModelChanges('TeamAvailability', 'EntityState')
        .pipe(
            distinctUntilKeyChanged(
                'entity',
                (entity1, entity2) => entity1.id === entity2.id
            )
        );

    constructor(
        private planUow: PlannerUowService,
        private teamFilter: BehaviorSubject<Team>
    ) {
        super();
    }

    get teamAvailDataSource(): TeamAvailability[] {
        return _l.flatMap(this.planUow.allTeamCats, x =>
            _l.flatMap(x.teams, m => m.teamAvailabilites)
        );
    }

    connect(): Observable<TeamAvailability[]> {
        const displayDataChanges = [
            this.dataSourceTeamAvailabitiy,
            this.teamFilter
        ];

        return merge(...displayDataChanges).pipe(
            map(_ => {
                const teamIdFIlter =
                    this.teamFilter.value && this.teamFilter.value.id;

                // Grab the page's slice of data.
                // const startIndex =
                //     this.matPaginator.pageIndex * this.matPaginator.pageSize;

                return this.teamAvailDataSource
                    .filter(tmAvail => tmAvail.teamId === teamIdFIlter)
                    .slice();
            })
        );
    }

    disconnect() {}
}
