import {
    Component,
    Inject,
    OnDestroy,
    OnInit,
    ViewEncapsulation
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { bareEntity } from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { Team } from 'app/features/aagt/data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as sa from 'sweetalert2';
import { TeamUowService } from '../team-uow.service';

@Component({
    selector: 'team-detail-dialog',
    templateUrl: './team-detail.dialog.html',
    animations: fuseAnimations,
    styleUrls: ['./team-detail.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamDetailDialogComponent implements OnInit, OnDestroy {
    currentTeam: Team;
    action: 'edit' | 'add';
    teamFormGroup: FormGroup;
    dialogTitle: string;
    teamTypes: string[];
    isNew = false;
    isValid = false;
    private unsubscribeAll: Subject<any>;

    constructor(
        private dialogRef: MatDialogRef<TeamDetailDialogComponent>,
        private formBuilder: FormBuilder,
        private uow: TeamUowService,
        @Inject(MAT_DIALOG_DATA) data: any
    ) {
        this.currentTeam = data;
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        const team = this.currentTeam;
        this.teamTypes = this.uow.teamTypes;
        if (this.currentTeam.entityAspect.entityState.isAdded()) {
            this.action = 'add';
            this.dialogTitle = 'Add Team';
        } else {
            this.action = 'edit';
            this.dialogTitle = 'Edit Team';
        }

        this.teamFormGroup = this.formBuilder.group({
            teamName: new FormControl(team.teamName, [Validators.required]),
            teamType: new FormControl(team.teamType, Validators.required),
            numberOfTeamMembers: new FormControl(team.numberOfTeamMembers),
            notes: new FormControl(team.notes)
        });
        this.teamFormGroup.statusChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(valid => {
                this.isValid = valid === 'VALID';
            });
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    cancel(): void {
        this.currentTeam.entityAspect.rejectChanges();
        this.dialogRef.close();
    }

    async deleteTeam(): Promise<void> {
        const config: sa.SweetAlertOptions = {
            title: 'Delete Trigger?',
            text: `Are you sure you?
            All associated team avalabilities will be deleted!`,
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        };
        try {
            const result = await sa.default.fire(config);
            if (!result.value) {
                return;
            }

            this.currentTeam.teamAvailabilites.forEach(ta =>
                ta.entityAspect.setDeleted()
            );
            this.currentTeam.entityAspect.setDeleted();
            const saveResult = await this.uow.saveTeam();
            this.dialogRef.close(saveResult);
            sa.default.fire('Deleted!', 'Team has been deleted', 'success');
        } catch (e) {}
    }

    saveChanges(del: string): void {
        Object.keys(this.teamFormGroup.controls).forEach(
            (key: keyof bareEntity<Team>) => {
                this.currentTeam[key] = this.teamFormGroup.get(key).value;
            }
        );
        this.uow.saveTeam().then(saveResult => {
            this.dialogRef.close(this.currentTeam);
        });
    }
}
