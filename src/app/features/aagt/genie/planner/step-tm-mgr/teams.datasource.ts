import { DataSource } from '@angular/cdk/table';
import { Team } from 'app/features/aagt/data';
import { EntityAction } from 'breeze-client';
import * as _l from 'lodash';
import { merge, BehaviorSubject, Observable } from 'rxjs';
import { distinctUntilKeyChanged, filter, map, tap } from 'rxjs/operators';
import { PlannerUowService } from '../planner-uow.service';

export class TeamDataSource extends DataSource<Team> {
    private dataSourceTrigger = this.planUow.aagtEmService.onEntityManagerChange.pipe(
        filter(
            x =>
                x.entity.shortname === 'TeamCategory' ||
                x.entity.shortname === 'Team'
        ),
        filter(ec => ec.entityAction === EntityAction.EntityStateChange),
        distinctUntilKeyChanged(
            'entity',
            (entity1, entity2) => entity1.id === entity2.id
        )
    );

    constructor(
        private planUow: PlannerUowService,
        private teamCatFilter: BehaviorSubject<string>
    ) {
        super();
    }

    get teamDataSource(): Team[] {
        return _l.flatMap(this.planUow.allTeamCats, x => x.teams);
    }

    connect(): Observable<Team[]> {
        const displayDataChanges = [this.dataSourceTrigger, this.teamCatFilter];

        return merge(...displayDataChanges).pipe(
            map(_ => {
                const teamCatFilter = this.teamCatFilter.value;
                return this.teamDataSource.slice().filter(team => {
                    let matchedRecord = false;
                    if (!this.teamCatFilter.value) {
                        return true;
                    }
                    if (this.teamCatFilter.value) {
                        matchedRecord =
                            teamCatFilter === 'all' ||
                            team.teamCategory.teamType === teamCatFilter;
                    }
                    return matchedRecord;
                });
            })
        );
    }

    disconnect() {}
}
