import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    MatDialog,
    MatDialogConfig,
    MatPaginator,
    MatSort
} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { Team } from 'app/features/aagt/data';
import { FilesDataSource } from 'app/global-data/';
import { fromEvent, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { TeamDetailDialogComponent } from '../team-detail/team-detail.dialog';
import { TeamUowService } from '../team-uow.service';

@Component({
    selector: 'app-team-list',
    templateUrl: './team-list.component.html',
    styleUrls: ['./team-list.component.scss'],
    animations: fuseAnimations,
    encapsulation: ViewEncapsulation.None
})
export class TeamListComponent implements OnInit, OnDestroy {
    dataSource: FilesDataSource<Team>;
    displayedColumns = ['id', 'teamName', 'teamCategory', 'teamMemberCount'];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;

    private unsubscribeAll: Subject<any>;

    constructor(
        private uow: TeamUowService,
        private teamDialog: MatDialog,
        private route: ActivatedRoute
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.dataSource = new FilesDataSource(
            this.uow.onTeamListChange.value,
            this.paginator,
            this.sort,
            this.uow.onTeamListChange
        );

        fromEvent(this.filter.nativeElement, 'keyup')
            .pipe(
                takeUntil(this.unsubscribeAll),
                debounceTime(1500),
                distinctUntilChanged()
            )
            .subscribe(() => {
                if (!this.dataSource) {
                    return;
                }
                this.dataSource.filter = this.filter.nativeElement.value;
            });
    }

    ngOnDestroy() {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    modifyTeam(team: Team): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.panelClass = 'team-detail-dialog';
        dialogCfg.data = team;
        this.teamDialog
            .open(TeamDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(data => {
                if (data) {
                    this.uow.fetchAllTeams();
                }
            });
    }

    newTeam(): void {
        const dialogCfg = new MatDialogConfig();
        this.uow.getTeam('new');
        dialogCfg.data = this.uow.onTeamChange.value;
        dialogCfg.panelClass = 'team-detail-dialog';

        this.teamDialog
            .open(TeamDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(data => {
                if (data) {
                    this.uow.fetchAllTeams();
                }
            });
    }
}
