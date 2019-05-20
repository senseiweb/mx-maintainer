import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';
import {
    ChangeDetectionStrategy,
    Component,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
    bufferTime,
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    startWith,
    takeUntil,
    tap
} from 'rxjs/operators';

import { SelectionModel } from '@angular/cdk/collections';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { MatDialog, MatPaginator } from '@angular/material';
import { fuseAnimations } from '@fuse/animations';
import { Team, TeamAvailability, TeamCategory } from 'app/features/aagt/data';
import { EntityAction } from 'breeze-client';
import * as _l from 'lodash';
import * as _m from 'moment';
import * as _sa from 'sweetalert2';
import { PlannerUowService } from '../planner-uow.service';
import { PlannerSteps } from '../planner.component';
import { TeamAvailDataSource } from './team-avail.datasource';
import { TeamDataSource } from './teams.datasource';

@Component({
    selector: 'genie-plan-step-tm-manager',
    templateUrl: './step-tm-mgr.component.html',
    styleUrls: ['./step-tm-mgr.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    animations: [
        trigger('detailExpand', [
            state(
                'collapsed',
                style({ height: '0px', minHeight: '0', display: 'none' })
            ),
            state('expanded', style({ height: '*' })),
            transition(
                'expanded <=> collapsed',
                animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
            )
        ]),
        fuseAnimations
    ]
})
export class StepTeamManagerComponent implements OnInit, OnDestroy {
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    categories: any[];
    hasTeams = false;
    hasStartDate = false;
    defaultStart: Date;
    teamsDataSource: TeamDataSource;
    teamAvailDataSoure: TeamAvailDataSource;
    teamAvailSelection: SelectionModel<TeamAvailability> = new SelectionModel(
        true,
        []
    );
    generationStart: Date;
    generawtionStop: Date;
    teamTableColumns = [
        'teamName',
        'teamCat',
        'numOfMbrs',
        'numOfShifts',
        'totalTimeAvail'
    ];
    teamAvailTableColumns = [
        'select',
        'id',
        'availStart',
        'availEnd',
        'duration'
    ];
    teamAvailFormGroup: FormGroup;
    expandedTeam: Team;
    teamCategories: TeamCategory[];
    currentCategory: TeamCategory;
    numOfDaysLeftInGeneration: number;
    teamCatSelectionFormGroup: FormGroup;
    private onFilterTeamCategoryChange = new BehaviorSubject('');
    private onExpandedTeamChange: BehaviorSubject<Team> = new BehaviorSubject(
        {} as any
    );
    searchTerm: string;

    private unsubscribeAll: Subject<any>;

    constructor(
        private planUow: PlannerUowService,
        private teamDetailDialog: MatDialog,
        private fb: FormBuilder
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.getTeamCategories();

        this.generationStart = this.planUow.currentGen.genStartDate;
        this.generawtionStop = this.planUow.currentGen.genEndDate;

        this.defaultStart = this.planUow.currentGen.genStartDate;

        this.teamAvailDataSoure = new TeamAvailDataSource(
            this.planUow,
            this.onExpandedTeamChange
        );

        this.teamsDataSource = new TeamDataSource(
            this.planUow,
            this.onFilterTeamCategoryChange
        );

        this.hasTeams = this.planUow.allTeamCats.some(
            teamCat => !!teamCat.teams.length
        );

        this.createTeamCatFilterForm();

        this.createNewTeamAvailForm();

        this.reactToModelChanges();
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    addAvailability(): void {
        const startDate = this.teamAvailFormGroup.get('availDate').value;
        const numOfHours = this.teamAvailFormGroup.get('numOfHours').value;
        let repeatNum = this.teamAvailFormGroup.get('repeatNum').value;
        const shiftStart = _m(startDate);

        do {
            const shiftEnd = shiftStart.clone().add(numOfHours, 'h');

            if (this.alreadyExist(shiftStart, shiftEnd)) {
                repeatNum--;
                continue;
            }

            this.removeOverlap(shiftStart, shiftEnd);

            this.expandedTeam.createChild('TeamAvailability', {
                availStart: shiftStart.toDate(),
                availEnd: shiftEnd.toDate(),
                manHoursAvail: shiftEnd.diff(shiftStart, 'm')
            });

            shiftStart.add(1, 'd');
            repeatNum--;
        } while (repeatNum > 0);

        this.teamAvailFormGroup.reset();
    }

    addModifyTeamCategory(teamCategory?: TeamCategory): void {
        throw new Error('Not Implmeneted');
    }

    private alreadyExist(start: _m.Moment, end: _m.Moment): boolean {
        return this.expandedTeam.teamAvailabilites.some(
            ta =>
                ta.availStart === start.toDate() && ta.availEnd === end.toDate()
        );
    }

    calcuateHours(minutes: number): number {
        return minutes ? Math.round(minutes / 60) : 0;
    }
    /**
     * Step is consider valid if all the action items associated
     * team categories have any team with availability.
     */
    checkStepValidity(): void {
        const teamCatsWithWork = _l.flatMap(
            this.planUow.currentGen.triggers,
            x => x.triggerActions.map(ta => ta.actionItem.teamCategory)
        );

        const neededTeamCats = [...new Set(teamCatsWithWork)];
        console.log(neededTeamCats);
        this.planUow.onStepValidityChange.next({
            [PlannerSteps[PlannerSteps.TmMgr]]: {
                isValid: neededTeamCats.every(tc =>
                    tc.teams.some(team => !!team.teamAvailabilites.length)
                )
            }
        });
    }

    compareCategories(cat1: TeamCategory, cat2: TeamCategory): boolean {
        return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
    }

    private createNewTeamAvailForm(): void {
        /**
         * Setup form controls first so that we get a direct
         * reference to them without going through the form group.
         * availDate --> holds the Shift start date;
         * repeatNum --> how many days to repeat this shift;
         * numOfHours --> the shift duration (num of work hours);
         */
        const availDate = new FormControl();
        const repeatNum = new FormControl(0, [Validators.min(0)]);
        const numOfHours = new FormControl(1, [
            Validators.min(1),
            Validators.max(24)
        ]);

        this.teamAvailFormGroup = this.fb.group({
            repeatNum,
            availDate,
            numOfHours
        });

        /**
         * Reactive form fields are disabled in the component vs the template.
         * These fields should only be enabled if there is a shift start date
         */
        repeatNum.disable();
        numOfHours.disable();

        /**
         * Watch the shift availability start date for changes, upon changes
         * calculate the number days left in this generation to limit the
         * the number of shifts that can be repeated.
         */
        availDate.valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(beginDate => {
                this.hasStartDate = !!beginDate;
                if (beginDate) {
                    this.numOfDaysLeftInGeneration = _m(
                        this.generawtionStop
                    ).diff(beginDate, 'day');

                    repeatNum.setValidators([
                        Validators.min(0),
                        Validators.max(this.numOfDaysLeftInGeneration)
                    ]);

                    numOfHours.enable();
                    repeatNum.enable();
                } else {
                    numOfHours.disable();
                    repeatNum.disable();
                }
            });
    }

    private createTeamCatFilterForm(): void {
        this.teamCatSelectionFormGroup = this.fb.group({
            teamCategorySelect: new FormControl('all')
        });

        this.teamCatSelectionFormGroup
            .get('teamCategorySelect')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe((teamCat: TeamCategory | 'all') => {
                if (teamCat === 'all') {
                    this.onFilterTeamCategoryChange.next(teamCat);
                    return;
                }
                const teamType = teamCat.teamType;
                this.onFilterTeamCategoryChange.next(teamType);
                this.hasTeams = this.teamsDataSource.teamDataSource.some(
                    tm => tm.teamCategory.teamType === teamType
                );
            });
    }

    deleteTeamAvailabilites(): void {
        const config: _sa.SweetAlertOptions = {
            title: 'Delete Selected Availabilites?',
            text: `Are you sure you?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        };
        _sa.default.fire(config).then(result => {
            if (!result.value) {
                return;
            }
            this.teamAvailSelection.selected.forEach(ta => {
                ta.entityAspect.setDeleted();
            });

            this.teamAvailSelection.clear();
            // this.tmAvailDataSource.data = this.currentTeam.teamAvailabilites;
            _sa.default.fire(
                'Deleted!',
                'Team Availabilities have been deleted',
                'success'
            );
        });
    }

    expandTeam(team: Team): void {
        if (this.expandedTeam === team) {
            this.expandedTeam = undefined;
            return;
        }

        this.expandedTeam = team;
        this.onExpandedTeamChange.next(team);
    }

    getTeamCategories(): void {
        /**
         * Gets all the team categories per the created trigger action,
         * this will result in duplicate team categories, so need to filter
         * out the duplicate team cats before extracting all teams.
         */
        const teamCats = _l.flatMap(this.planUow.currentGen.triggers, x =>
            _l.flatMap(x.triggerActions, t => t.actionItem.teamCategory)
        );

        this.teamCategories = _l.uniqBy(teamCats, 'id');
    }

    /** Determines if the expandedTeam has all of its children availabilities selected */
    get isAllSelected(): boolean {
        if (!this.expandedTeam) {
            return false;
        }
        return (
            this.teamAvailSelection.selected.length ===
            this.expandedTeam.teamAvailabilites.length
        );
    }

    /** Performs a selection of all the team availabilites for the expanded team */
    masterToggle(): void {
        this.isAllSelected
            ? this.teamAvailSelection.clear()
            : this.teamAvailDataSoure.teamAvailDataSource
                  .filter(ta => ta.teamId === this.expandedTeam.id)
                  .forEach(row => this.teamAvailSelection.select(row));
    }

    private reactToModelChanges(): void {
        this.checkStepValidity();

        this.planUow.aagtEmService
            .onModelChanges('TriggerAction', 'EntityState')
            .pipe(
                debounceTime(1500),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(_ => {
                this.getTeamCategories();
                this.setValidDateRange();
            });

        this.planUow.aagtEmService
            .onModelChanges('TeamAvailability', 'EntityState')
            .pipe(
                debounceTime(1500),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(_ => {
                console.log(_.args);
                this.checkStepValidity();
            });

        this.planUow.aagtEmService
            .onModelChanges('Generation', 'PropertyChange', 'genStartDate')
            .pipe(
                debounceTime(1500),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(_ => {
                console.log(_.args);
                this.setValidDateRange();
            });
    }

    private removeOverlap(start: _m.Moment, end: _m.Moment): void {
        const overLappingShifts = this.expandedTeam.teamAvailabilites.filter(
            ta =>
                _m(ta.availStart).isBetween(start, end) ||
                _m(ta.availEnd).isBetween(start, end)
        );
        overLappingShifts.forEach(ovlp => ovlp.entityAspect.setDeleted());
    }

    private setValidDateRange(): void {
        this.generationStart = this.planUow.currentGen.genStartDate;
        this.generawtionStop = this.planUow.currentGen.genEndDate;
    }

    tallyTotal(team: Team): number {
        return team.calTotalAvailDuringGen(
            this.generationStart,
            this.generawtionStop
        );
    }
}
