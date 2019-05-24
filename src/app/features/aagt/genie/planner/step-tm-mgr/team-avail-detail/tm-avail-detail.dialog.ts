import { SelectionModel } from '@angular/cdk/collections';
import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewChild,
    ViewEncapsulation
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import {
    MatDialogRef,
    MatPaginator,
    MatTableDataSource,
    MAT_DIALOG_DATA
} from '@angular/material';
import { IDialogResult } from '@ctypes/breeze-type-customization';
import { Team, TeamAvailability } from 'app/features/aagt/data';
import * as _m from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as sa from 'sweetalert2';
import { PlannerUowService } from '../../planner-uow.service';

@Component({
    selector: 'tm-avail-detail-dialog',
    templateUrl: './tm-avail-detail.dialog.html',
    styleUrls: ['./tm-avail-detail.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TmAvailDetailDialogComponent implements OnInit, OnDestroy {
    constructor(
        private dialogRef: MatDialogRef<TmAvailDetailDialogComponent>,
        private formBuilder: FormBuilder,
        private planUow: PlannerUowService,
        @Inject(MAT_DIALOG_DATA) private currentTeam: Team
    ) {
        this.generationStart = planUow.currentGen.genStartDate;
        this.generationStop = planUow.currentGen.genEndDate;
        this.tmAvailDataSource = new MatTableDataSource(
            this.currentTeam.teamAvailabilites
        );
        this.unsubscribeAll = new Subject();
    }

    @ViewChild(MatPaginator)
    paginator: MatPaginator;

    tmAvailDataSource: MatTableDataSource<TeamAvailability>;
    selection: SelectionModel<TeamAvailability>;
    displayedColumns = ['select', 'id', 'availStart', 'availEnd', 'duration'];
    tmAvailFormGroup: FormGroup;
    generationStart: Date;
    generationStop: Date;
    numberOfDaysLeft: number;
    hasDates = false;
    dialogTitle: string;
    private unsubscribeAll: Subject<any>;

    ngOnInit(): void {
        this.dialogTitle = `Add ${this.currentTeam.teamName} Availabilities`;
        this.selection = new SelectionModel(true, []);
        this.tmAvailDataSource.paginator = this.paginator;

        const availDate = new FormControl();
        const numOfHours = new FormControl(1, [
            Validators.min(1),
            Validators.max(24)
        ]);

        const repeatNum = new FormControl(0, [Validators.min(0)]);

        this.tmAvailFormGroup = this.formBuilder.group({
            availDate,
            numOfHours,
            repeatNum
        });

        repeatNum.disable();
        numOfHours.disable();

        availDate.valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(dateSet => {
                if (dateSet) {
                    const numberOfDaysLeft = (this.numberOfDaysLeft = _m(
                        this.generationStop
                    ).diff(dateSet, 'd'));

                    repeatNum.setValidators([
                        Validators.min(0),
                        Validators.max(numberOfDaysLeft)
                    ]);

                    this.hasDates = true;
                    numOfHours.enable();
                    repeatNum.enable();
                } else {
                    this.hasDates = false;
                    numOfHours.disable();
                    repeatNum.disable();
                }
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    // addAvailability(): void {
    //     const startDate = this.tmAvailFormGroup.get('availDate').value;
    //     const numOfHours = this.tmAvailFormGroup.get('numOfHours').value;
    //     let repeatNum = this.tmAvailFormGroup.get('repeatNum').value;
    //     const shiftStart = _m(startDate);

    //     do {
    //         const shiftEnd = shiftStart.clone().add(numOfHours, 'h');

    //         if (this.alreadyExist(shiftStart, shiftEnd)) {
    //             repeatNum--;
    //             continue;
    //         }

    //         this.removeOverlap(shiftStart, shiftEnd);
    //         this.currentTeam
    //         this.planUow.createTeamAvailability({
    //             teamId: this.currentTeam.id,
    //             availStart: shiftStart.toDate(),
    //             availEnd: shiftEnd.toDate(),
    //             manHoursAvail: shiftEnd.diff(shiftStart, 'm')
    //         });
    //         shiftStart.add(1, 'd');
    //         repeatNum--;
    //     } while (repeatNum > 0);

    //     this.tmAvailDataSource.data = this.currentTeam.teamAvailabilites.sort(
    //         (a, b) => {
    //             return a.availStart < b.availStart ? -1 : 1;
    //         }
    //     );

    //     this.tmAvailFormGroup.reset();
    // }

    calcuateHours(minutes: number): number {
        return minutes ? Math.round(minutes / 60) : 0;
    }

    close(): void {
        const result: IDialogResult<TeamAvailability> = {
            wasConceled: true
        };
        this.dialogRef.close(result);
    }

    private alreadyExist(start: _m.Moment, end: _m.Moment): boolean {
        return this.currentTeam.teamAvailabilites.some(
            ta =>
                ta.availStart === start.toDate() && ta.availEnd === end.toDate()
        );
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.tmAvailDataSource.data.length;
        return numSelected === numRows;
    }

    private removeOverlap(start: _m.Moment, end: _m.Moment): void {
        const overLappingShifts = this.currentTeam.teamAvailabilites.filter(
            ta =>
                _m(ta.availStart).isBetween(start, end) ||
                _m(ta.availEnd).isBetween(start, end)
        );
        overLappingShifts.forEach(ovlp => ovlp.entityAspect.setDeleted());
    }

    deleteTeamAvailabilites(): void {
        const config: sa.SweetAlertOptions = {
            title: 'Delete Selected Availabilites?',
            text: `Are you sure you?`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        };
        sa.default.fire(config).then(result => {
            if (!result.value) {
                return;
            }
            this.selection.selected.forEach(ta => {
                ta.entityAspect.setDeleted();
            });

            this.selection.clear();
            this.tmAvailDataSource.data = this.currentTeam.teamAvailabilites;
            sa.default.fire(
                'Deleted!',
                'Team Availabilities have been deleted',
                'success'
            );
        });
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected()
            ? this.selection.clear()
            : this.tmAvailDataSource.data.forEach(row =>
                  this.selection.select(row)
              );
    }

    get defaultStart(): Date {
        const start = _m();
        const remainder = 30 - (start.minute() % 30);
        return start.add(remainder, 'minute').toDate();
    }
}
