import { Component, OnDestroy, OnInit } from '@angular/core';
import { zip, Subject } from 'rxjs';
import {
    combineAll,
    debounce,
    debounceTime,
    distinctUntilChanged,
    map,
    startWith,
    switchMap,
    take,
    takeUntil
} from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';

import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { IDialogResult } from '@ctypes/breeze-type-customization';
import { Team, TeamAvailability, TeamCategory } from 'app/features/aagt/data';
import { PlannerUowService } from '../planner-uow.service';
import { PlannerSteps } from '../planner.component';
import { TmAvailDetailDialogComponent } from './team-avail-detail/tm-avail-detail.dialog';

@Component({
    selector: 'genie-plan-step-tm-manager',
    templateUrl: './step-tm-mgr.component.html',
    styleUrls: ['./step-tm-mgr.component.scss'],
    animations: fuseAnimations
})
export class StepTeamManagerComponent implements OnInit, OnDestroy {
    categories: any[];
    private allTeams: Team[];
    filteredTeams: Team[];
    teamCategories: TeamCategory[];
    currentCategory: TeamCategory;
    filteredFormGroup: FormGroup;
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
        this.teamCategories = this.planUow.allTeamCats;
        this.filteredTeams = this.allTeams = this.planUow.allTeams;
        this.planUow.onStepValidityChange.next({
            [PlannerSteps[PlannerSteps.TmMgr]]: {
                isValid: true
            }
        });
        this.filteredFormGroup = this.fb.group({
            searchTerm: new FormControl(),
            currentCategory: new FormControl()
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

    compareCategories(cat1: TeamCategory, cat2: TeamCategory): boolean {
        return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
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
}
