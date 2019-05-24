import { MxmAppName } from 'app/app-config.service';
import { BzEntity, BzProp, SpEntityBase } from 'app/global-data';
import * as _l from 'lodash';
import * as _m from 'moment';
import { RequestError } from 'request-promise/errors';
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

@BzEntity(MxmAppName.Aagt, {})
export class TeamCategory extends SpEntityBase {
    readonly shortname = 'TeamCategory';

    @BzProp('data', {
        spInternalName: 'Title',
        dataCfg: { isNullable: false }
    })
    teamType: string;

    @BzProp('data', { dataCfg: { isNullable: false } })
    teamCatColor: string;

    @BzProp('nav', {
        relativeEntity: 'Team'
    })
    teams: Team[];

    addJobReservation = (
        request: IJobReservateionRequest
    ): IJobReservationReceipt => {
        /** Capture the ideal task start period */
        let start = request.requestedStartDate;

        /** Create a receipt holder */
        const receipt: IJobReservationReceipt = {} as any;

        /** Iterate over the task duration until all has been scheduled */
        while (request.taskDuration.asMinutes()) {
            /** Find the next available shift */
            const teamAvail = this.getNextAvailableStart(start);

            /** If no team is available, simply return the empty object */
            if (!teamAvail) {
                return receipt;
            }

            /** Shave off 30 minutes to account for a shift change over */
            const endOfShift = _m(teamAvail.availEnd).subtract(30, 'minutes');

            /** Calculate how much of the selected availability has already been reserved */
            const totalReserved = teamAvail.jobReservations.length
                ? _l.sumBy(teamAvail.jobReservations, x =>
                      _m.duration(x.jobEnd.diff(x.jobStart)).asMinutes()
                  )
                : 0;

            /**
             * Find the next empty slot by taking the availiability start
             * add 30 minutes to account for job change over i.e. moving equipment,
             * work breaks, or personnel changes.
             * Then add in the amount of time that has already been reserved.
             *
             */
            const nextTimeSlot = _m(teamAvail.availStart)
                .add(30, 'minute')
                .add(totalReserved);

            /**
             * Handle the case where there is time available before the
             * task is available. i.e. a team availability starts at 0800
             * but the task cannot start NET 1500. so the next time slot
             * becomes the start time.
             * This may not be necessary because we check when getting the next
             * availability.
             */
            // nextTimeSlot = nextTimeSlot.isSameOrAfter(start)
            //     ? nextTimeSlot
            //     : start;

            /**
             * Given the start time slot, how much time is available between start and
             * end of the shift.
             */
            const durationAvailable = _m.duration(
                endOfShift.diff(nextTimeSlot)
            );

            /**
             * Take the lesser of the time available to the end of shift or
             * task duration to calculate the jobEnd reservation time.
             */
            const timeNeededOrAvailableToComplete =
                durationAvailable.asMinutes() > request.taskDuration.asMinutes()
                    ? request.taskDuration
                    : durationAvailable;

            const reserveration: IJobReservation = {
                taskId: request.taskId,
                jobStart: nextTimeSlot,
                jobEnd: nextTimeSlot
                    .clone()
                    .add(timeNeededOrAvailableToComplete)
            };

            teamAvail.jobReservations.push(reserveration);

            /**
             * Keep the planned start as we continue the process of schedule the task
             * if multiple iterations is needed.
             */
            receipt.plannedStart = receipt.plannedStart || nextTimeSlot;

            /**
             * Set the start to the end and do it again, if needed.
             */
            start = receipt.plannedEnd = reserveration.jobEnd;

            request.taskDuration.subtract(timeNeededOrAvailableToComplete);
        }

        receipt.durationPlanned = _m.duration(
            receipt.plannedEnd.diff(receipt.plannedStart)
        );

        return receipt;
    }

    private getNextAvailableStart = (start: _m.Moment): TeamAvailability => {
        const allTeamAvails = _l.flatMap(this.teams, team =>
            team.teamAvailabilites.filter(
                ta =>
                    ta.nextAvail ||
                    (start.isSameOrBefore(ta.availStart) ||
                        (start.isBetween(
                            ta.availStart,
                            ta.availEnd,
                            'm',
                            '()'
                        ) &&
                            !ta.isFullyBooked))
            )
        );

        if (!allTeamAvails.length) {
            return undefined;
        }
        const orderedTeamAvails = _l.orderBy(allTeamAvails, [
            ta => ta.durationFromStart(start),
            ta => ta.team.id,
            ta => ta.availStart.getTime()
        ]);

        orderedTeamAvails.forEach((item, index) => {
            console.log(
                index,
                allTeamAvails.findIndex(ta => ta.id === item.id)
            );
        });
        return orderedTeamAvails[0];
    }
}
