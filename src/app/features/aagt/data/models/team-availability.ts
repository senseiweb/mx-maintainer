import { Injectable } from '@angular/core';
import { MxmAppName, SpListName } from 'app/app-config.service';
import * as ebase from 'app/global-data';
import {
    BzDataProp,
    BzEntity,
    BzNavProp
} from 'app/global-data/models/_entity-decorators';
import { DataType } from 'breeze-client';
import * as _ from 'lodash';
import * as _m from 'moment';
import { AagtDataModule } from '../aagt-data.module';
import { Team } from './team';
export interface IJobReservation {
    taskId: number;
    jobStart: _m.Moment;
    jobEnd: _m.Moment;
}

@BzEntity(MxmAppName.Aagt, { shortName: SpListName.TeamAvailability })
export class TeamAvailability extends ebase.SpEntityBase {
    @BzDataProp({
        dataType: DataType.String,
        spInternalName: 'Title'
    })
    availabilityTitle: string;

    jobReservations: IJobReservation[] = [];

    get isFullyBooked(): boolean {
        const totalJobTime = _m.duration(0);
        const availShiftTime = _m.duration(this.manHoursAvail);
        this.jobReservations.forEach(jr => {
            const jobTime = _m.duration(jr.jobEnd.diff(jr.jobStart));
            totalJobTime.add(jobTime);
        });
        return availShiftTime.subtract(totalJobTime).asHours() < 1;
    }
    get jobResSerialize(): string {
        return JSON.stringify(this.jobReservations);
    }
    set jobResSerialize(serializeJob) {
        if (!serializeJob) {
            return;
        }
        const parsedJobRes = JSON.parse(serializeJob) as IJobReservation[];
        parsedJobRes.forEach(jr => {
            jr.jobStart = _m(jr.jobStart);
            jr.jobEnd = _m(jr.jobEnd);
        });
        this.jobReservations = [];
    }

    @BzDataProp()
    teamId: number;

    @BzDataProp()
    availStart: Date;

    nextAvail: _m.Moment;

    @BzDataProp()
    availEnd: Date;

    @BzDataProp()
    manHoursAvail: number;

    @BzNavProp()
    team: Team;

    durationFromStart = (start: _m.Moment): number => {
        const availStart = this.nextAvail || _m(this.availStart);
        return _m
            .duration(availStart.diff(start))
            .abs()
            .asMinutes();
    }
}

// @Injectable({
//     providedIn: AagtDataModule
// })
// export class TeamAvailabilityMetadata extends ebase.MetadataBase<
//     TeamAvailability
// > {
//     metadataFor = TeamAvailability;

//     constructor() {
//         super(SpListName.TeamAvailability);
//         this.entityDefinition.dataProperties.availabilityTitle = {
//             spInternalName: 'Title',
//             dataType: this.dt.String,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.teamId = {
//             dataType: this.dt.Int32,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.availStart = {
//             dataType: this.dt.DateTime,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.availEnd = {
//             dataType: this.dt.DateTime,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.manHoursAvail = {
//             dataType: this.dt.Int32,
//             isNullable: false
//         };
//         this.entityDefinition.dataProperties.jobResSerialize = {
//             dataType: this.dt.String
//         };

//         this.entityDefinition.navigationProperties = {
//             team: {
//                 entityTypeName: SpListName.Team,
//                 associationName: 'Team_TeamAvailabilities',
//                 foreignKeyNames: ['teamId']
//             }
//         };

//         Object.assign(
//             this.entityDefinition.dataProperties,
//             this.baseDataProperties
//         );
//     }
// }
