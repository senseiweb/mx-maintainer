import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import {
    debounceTime,
    distinctUntilChanged,
    filter,
    map,
    startWith,
    takeUntil,
    tap
} from 'rxjs/operators';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { IDialogResult } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { Team, TeamAvailability, TeamCategory } from 'app/features/aagt/data';
import { EntityAction } from 'breeze-client';
import * as _ from 'lodash';
import { PlannerUowService } from '../planner-uow.service';
import { PlannerSteps } from '../planner.component';
import { TmAvailDetailDialogComponent } from './team-avail-detail/tm-avail-detail.dialog';

interface ITeamTableDef<T> {
    [columnId: string]: [string, keyof T | string];
}

@Component({
    selector: 'genie-plan-step-tm-manager',
    templateUrl: './step-tm-mgr.component.html',
    styleUrls: ['./step-tm-mgr.component.scss'],
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
    categories: any[];
    private allTeams: Team[];
    filteredTeams: Team[];
    dataSource: any;
    oKeys = Object.keys;
    teamColumnDef: ITeamTableDef<Team> = {
        teamname: ['Team Name', 'teamName'],
        teamcat: ['Team Category', 'teamCategory.teamType'],
        numOfMbrs: ['# Members', 'numTeamMembers'],
        numOfShifts: ['# Shifts', 'numOfShifts'],
        totalTimeAvail: ['Total Available Hours', 'totalTimeAvail']
    };
    expandedTeam: Team;
    teamCategories: TeamCategory[];
    currentCategory: TeamCategory;
    teamCatSelectionFormGroup: FormGroup;
    private filterTeamCategoryBy = new BehaviorSubject('');
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
        this.filteredTeams = this.allTeams = _.flatMap(
            this.teamCategories,
            x => x.teams
        );

        this.filteredFormGroup = this.fb.group({
            searchTerm: new FormControl(),
            currentCategory: new FormControl()
        });

        this.planUow.aagtEmService.onEntityManagerChange
            .pipe(
                tap(ec => console.log(ec)),
                filter(
                    ec =>
                        ec.entity.shortname === 'TriggerAction' &&
                        ec.entityAction === EntityAction.EntityStateChange
                )
            )
            .subscribe(unused => {
                this.getTeamCategories();
                this.checkStepValidity();
            });

        this.filteredFormGroup
            .get('searchTerm')
            .valueChanges.pipe(
                debounceTime(500),
                distinctUntilChanged(),
                startWith(''),
                map(term => term.toLowerCase()),
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(term => {
                this.searchTerm = term;
                this.filterTeamsBy();
            });

        this.filteredFormGroup
            .get('currentCategory')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe(selectCategory => {
                this.currentCategory = selectCategory;
                this.filterTeamsBy();
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    addModifyTeamCategory(teamCategory?: TeamCategory): void {
        throw new Error('Not Implmeneted');
    }

    get categoryFilter(): string {
        return this.filterTeamCategoryBy.value;
    }

    set categoryFIlter(catFilter: string) {
        this.filterTeamCategoryBy.next(catFilter);
    }

    checkStepValidity(): void {
        this.planUow.onStepValidityChange.next({
            [PlannerSteps[PlannerSteps.TmMgr]]: {
                isValid: !!this.allTeams
            }
        });
    }

    compareCategories(cat1: TeamCategory, cat2: TeamCategory): boolean {
        return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
    }

    getTeamCategories(): void {
        /**
         * Gets all the team categories per the created trigger action,
         * this will result in duplicate team categories, so need to filter
         * out the duplicate team cats before extracting all teams.
         */
        const teamCats = _.flatMap(this.planUow.currentGen.triggers, x =>
            _.flatMap(x.triggerActions, t => t.actionItem.teamCategory)
        );

        this.teamCategories = _.uniqBy(teamCats, 'id');

        this.allTeams = _.flatMap(this.teamCategories, x => x.teams);
        this.filterTeamsBy();
    }

    filterTeamsBy(): void {
        let teams = this.allTeams;

        // Filter
        teams =
            (this.currentCategory &&
                teams.filter(
                    t => t.teamCategoryId === this.currentCategory.id
                )) ||
            teams;

        teams =
            (this.searchTerm &&
                teams.filter(team =>
                    JSON.stringify(team).includes(this.searchTerm)
                )) ||
            teams;
        this.filteredTeams = teams;
    }

    openTeam(team: Team): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = team;
        dialogCfg.panelClass = 'tm-avail-detail-dialog';
        dialogCfg.disableClose = true;
        this.teamDetailDialog
            .open(TmAvailDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe<IDialogResult<TeamAvailability>>(
                takeUntil(this.unsubscribeAll)
            )
            .subscribe(result => {
                const currentGen = this.planUow.currentGen;
                team.calTotalAvailDuringGen(
                    currentGen.genStartDate,
                    currentGen.genEndDate
                );
            });
    }

    get teamTableColumnDefs(): string[] {
        const keys = this.oKeys(this.teamColumnDef);
        const columns = keys.map(key => this.teamColumnDef[key][0]);
        return columns;
    }
}
