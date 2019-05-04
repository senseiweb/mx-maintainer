import { findNode } from '@angular/compiler';
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
import {
    bareEntity,
    IDialogResult,
    Omit
} from '@ctypes/breeze-type-customization';
import { fuseAnimations } from '@fuse/animations';
import { Team, TeamCategory } from 'app/features/aagt/data';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as sa from 'sweetalert2';
import { TeamUowService } from '../team-uow.service';

type TeamModelProps = keyof bareEntity<Team>;
type TeamFormModel = { [key in TeamModelProps]: any };
type TeamCatFormMode = 'edit' | 'select' | 'add';

@Component({
    selector: 'team-detail-dialog',
    templateUrl: './team-detail.dialog.html',
    animations: fuseAnimations,
    styleUrls: ['./team-detail.dialog.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TeamDetailDialogComponent implements OnInit, OnDestroy {
    formMode: 'edit' | 'add';
    teamFormGroup: FormGroup;
    teamCategories: TeamCategory[];
    teamCatFormMode: TeamCatFormMode;
    selectedTeamCat: TeamCategory;
    isDeleting = false;
    isSaving: Observable<boolean>;
    dialogTitle: string;
    teamCatgories: string[];
    private modelProps: TeamModelProps[] = [
        'teamName',
        'teamCategory',
        'numTeamMembers',
        'notes'
    ];
    private unsubscribeAll: Subject<any>;

    constructor(
        private dialogRef: MatDialogRef<TeamDetailDialogComponent>,
        private formBuilder: FormBuilder,
        private teamUow: TeamUowService,
        @Inject(MAT_DIALOG_DATA) private currentTeam: Team
    ) {
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        const team = this.currentTeam;
        this.teamCategories = this.teamUow.teamCategories;
        if (this.currentTeam.entityAspect.entityState.isAdded()) {
            this.formMode = 'add';
            this.dialogTitle = 'Add New Team';
        } else {
            this.formMode = 'edit';
            this.dialogTitle = `Editing ${this.currentTeam.teamName}`;
        }

        this.teamCatFormMode = 'select';

        const formModel: Partial<TeamFormModel> = {};
        const formValidators =
            team.entityType.custom && team.entityType.custom.formValidators;

        this.modelProps.forEach(prop => {
            formModel[prop] = new FormControl(
                team[prop],
                formValidators && formValidators.get(prop)
            );
        });

        formModel['editCategory'] = new FormControl();

        this.teamFormGroup = this.formBuilder.group(formModel);

        this.teamFormGroup
            .get('teamCategory')
            .valueChanges.pipe(takeUntil(this.unsubscribeAll))
            .subscribe(selectedCat => {
                this.selectedTeamCat = selectedCat;
            });

        this.selectedTeamCat = this.currentTeam.teamCategory;
        this.isSaving = this.teamUow.isSaving;
    }

    ngOnDestroy(): void {
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    addCategory(): void {
        const newTeamCat = this.teamUow.createTeamCategory();
        this.selectedTeamCat = newTeamCat;
        this.editCategory();
    }

    cancel(): void {
        this.currentTeam.entityAspect.rejectChanges();
        const teamDialogResult: IDialogResult<Team> = {
            wasConceled: true
        };
        this.dialogRef.close(teamDialogResult);
    }

    cancelCategory(): void {
        this.selectedTeamCat.entityAspect.rejectChanges();
        this.selectedTeamCat = undefined;
        this.teamCatFormMode = 'select';
    }

    compareCategories(cat1: TeamCategory, cat2: TeamCategory): boolean {
        return cat1 && cat2 ? cat1.id === cat2.id : cat1 === cat2;
    }

    async confirmedDelete(): Promise<void> {
        await sa.default.fire('Deleted!', 'Item has been deleted', 'success');
    }

    async deleteTeam(): Promise<void> {
        const result = await this.confirmDeletion();
        if (!result.value) {
            return;
        }
        this.isDeleting = true;
        this.currentTeam.teamAvailabilites.forEach(ta =>
            ta.entityAspect.setDeleted()
        );
        this.currentTeam.entityAspect.setDeleted();
        try {
            const saveResult = await this.teamUow.saveTeam();
            const diagResult: IDialogResult<Team> = {
                confirmDeletion: true,
                value: saveResult as any
            };
            await this.confirmedDelete();
            this.dialogRef.close(diagResult);
        } catch (e) {
            await sa.default.fire(
                'U Oh!',
                'There was a problem deleting this team, please try again later',
                'error'
            );
            console.log(e);
        } finally {
            this.isDeleting = false;
            const errorResult: IDialogResult<Team> = {
                confirmDeletion: false
            };
            this.dialogRef.close(errorResult);
        }
    }

    async deleteTeamCategory(): Promise<void> {
        const response = await this.confirmDeletion();
        if (!response) {
            return;
        }
        this.selectedTeamCat.entityAspect.setDeleted();
        // TODO: add error handler
        const result = await this.teamUow.saveTeamCategory();
        this.teamCategories = this.teamUow.teamCategories;
        this.teamCatFormMode = 'select';
        this.teamFormGroup.get('teamCategory').setValue(undefined);
        this.confirmedDelete();
    }

    async confirmDeletion(): Promise<any> {
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
        const result = await sa.default.fire(config);

        return result;
    }

    editCategory(): void {
        this.teamCatFormMode = 'edit';

        const editFormControl = this.teamFormGroup.get('editCategory' as any);

        editFormControl.setValue(this.selectedTeamCat.teamType, {
            emitValue: false
        });

        editFormControl.valueChanges
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(changes => {
                this.selectedTeamCat.teamType = changes;
            });
    }

    async saveCategory(): Promise<void> {
        const s = await this.teamUow.saveTeamCategory();
        this.teamCategories = this.teamUow.teamCategories;
        this.teamFormGroup
            .get('teamCategory')
            .setValue(this.selectedTeamCat, { emitValue: false });
        this.teamCatFormMode = 'select';
    }

    async saveChanges(): Promise<void> {
        this.modelProps.forEach(prop => {
            const currProp = this.currentTeam[prop];
            const teamProp = this.teamFormGroup.get(prop).value;
            // Only update properties that have changes
            if (currProp !== teamProp) {
                this.currentTeam[prop] = teamProp;
            }
        });
        try {
            const saveResult = await this.teamUow.saveTeam();
            const diagResult: IDialogResult<Team> = {
                confirmChange: true,
                value: saveResult as any
            };
            this.dialogRef.close(diagResult);
        } catch (e) {
            await sa.default.fire(
                'U Oh!',
                'There was a problem saving this team, please try again later',
                'error'
            );
            console.log(e);
            const result: IDialogResult<Team> = {
                confirmChange: false
            };
            this.dialogRef.close(result);
        }
    }
}
