import { Injectable } from '@angular/core';
import * as ebase from 'app/global-data';
import * as _ from 'lodash';
import * as _m from 'moment';
import { AagtDataModule } from '../aagt-data.module';
import * as aagtCfg from './_aagt-feature-cfg';
import { Team } from './team';
import { IJobReservation, TeamAvailability } from './team-availability';

export interface IJobReservateionRequest {
    taskId: number;
    requestedStartDate: _m.Moment;
    taskDuration: _m.Duration;
}
export interface IJobReservationReceipt {
    plannedStart: _m.Moment;
    plannedEnd: _m.Moment;
    durationPlanned: _m.Duration;
}
export class TeamCategory extends ebase.SpEntityBase {
    teamType: string;
    teams: Team[];

    addJobReservation = (
        request: IJobReservateionRequest
    ): IJobReservationReceipt => {
        let start = request.requestedStartDate;
        const receipt: IJobReservationReceipt = {} as any;
        while (request.taskDuration.asMinutes()) {
            const teamAvail = this.getNextAvailableStart(start);
            if (!teamAvail) {
                return receipt;
            }
            const endOfShift = _m(teamAvail.availEnd).subtract(30, 'minutes');
            const totalReserved = teamAvail.jobReservations.length
                ? _.sumBy(teamAvail.jobReservations, x =>
                      _m.duration(x.jobEnd.diff(x.jobStart)).asMinutes()
                  )
                : 0;
            let nextTimeSlot = _m(teamAvail.availStart)
                .add(30, 'minute')
                .add(totalReserved);

            nextTimeSlot = nextTimeSlot.isSameOrAfter(start)
                ? nextTimeSlot
                : start;

            const durationAvailable = _m.duration(
                endOfShift.diff(nextTimeSlot)
            );
            const reserveration: IJobReservation = {
                taskId: request.taskId,
                jobStart: nextTimeSlot,
                jobEnd: nextTimeSlot.add(durationAvailable)
            };
            teamAvail.jobReservations.push(reserveration);
            teamAvail.nextAvail = reserveration.jobEnd;
            receipt.plannedStart = receipt.plannedStart || nextTimeSlot;
            receipt.durationPlanned = _m.duration(
                receipt.plannedEnd.diff(receipt.plannedStart)
            );
            start = receipt.plannedEnd = reserveration.jobEnd;
            request.taskDuration.subtract(durationAvailable);
        }
        return receipt;
    }

    private getNextAvailableStart = (start: _m.Moment): TeamAvailability => {
        const allTeamAvails = _.flatMap(this.teams, team =>
            team.teamAvailabilites.filter(
                ta =>
                    (ta.nextAvail || _m(ta.availStart)).isSameOrAfter(start) &&
                    !ta.isFullyBooked
            )
        );

        if (!allTeamAvails.length) {
            return undefined;
        }
        const orderedTeamAvails = _.orderBy(allTeamAvails, [
            teamAvail => teamAvail.durationFromStart(start),
            teamAvail => teamAvail.team.id,
            teamAvail => teamAvail.availStart.getTime()
        ]);

        return orderedTeamAvails[0];
    }
}

@Injectable({
    providedIn: AagtDataModule
})
export class TeamCategoryMetadata extends ebase.MetadataBase<TeamCategory> {
    metadataFor = TeamCategory;

    constructor() {
        super(aagtCfg.AagtListName.TeamCategory);
        this.entityDefinition.dataProperties.teamType = {
            dataType: this.dt.String,
            isNullable: false,
            spInternalName: 'Title'
        };

        this.entityDefinition.navigationProperties = {
            teams: {
                entityTypeName: aagtCfg.AagtListName.Team,
                associationName: 'TeamCategory_Teams',
                isScalar: false
            }
        };

        Object.assign(
            this.entityDefinition.dataProperties,
            this.baseDataProperties
        );
    }
}
