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
    MatSort,
    MatTableDataSource
} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { IDialogResult } from '@ctypes/breeze-type-customization';
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
    dataSource: MatTableDataSource<Team>;
    displayedColumns = ['id', 'teamName', 'teamCategory', 'teamMemberCount'];
    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    @ViewChild(MatSort)
    sort: MatSort;

    @ViewChild('filter')
    filter: ElementRef;

    private unsubscribeAll: Subject<any>;

    constructor(
        private teamUow: TeamUowService,
        private teamDetailDialog: MatDialog
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit() {
        this.dataSource = new MatTableDataSource(this.teamUow.allTeams);

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
        this.teamDetailDialog
            .open(TeamDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe<IDialogResult<Team>>(takeUntil(this.unsubscribeAll))
            .subscribe(result => {
                if (!result.wasConceled) {
                    this.dataSource.data = this.teamUow.allTeams;
                }
            });
    }

    newTeam(): void {
        const dialogCfg = new MatDialogConfig();
        dialogCfg.data = this.teamUow.createTeam();
        dialogCfg.panelClass = 'team-detail-dialog';
        dialogCfg.disableClose = true;
        this.teamDetailDialog
            .open(TeamDetailDialogComponent, dialogCfg)
            .afterClosed()
            .pipe<IDialogResult<Team>>(takeUntil(this.unsubscribeAll))
            .subscribe(result => {
                if (!result.wasConceled) {
                    this.dataSource.data = this.teamUow.allTeams;
                }
            });
    }
}
