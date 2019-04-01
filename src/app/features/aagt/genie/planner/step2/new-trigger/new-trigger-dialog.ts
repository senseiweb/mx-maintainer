import {
    Component,
    Inject,
    Input,
    OnDestroy,
    OnInit,
    Output
} from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    Validators
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Trigger } from 'app/features/aagt/data';
import { Subject } from 'rxjs';
import { debounce, takeUntil } from 'rxjs/operators';
import { PlannerUowService } from '../../planner-uow.service';
import { existingMilestoneValidator } from './new-trigger.validator';

@Component({
    selector: 'new-trigger-dialog',
    templateUrl: './new-trigger-dialog.html'
})
export class NewTriggerDialogComponent implements OnInit, OnDestroy {
    currentTrigger: Trigger;
    triggerFormGroup: FormGroup;
    isNew = false;
    isValid = false;
    private unsubscribeAll: Subject<any>;

    constructor(
        private dialogRef: MatDialogRef<NewTriggerDialogComponent>,
        private formBuilder: FormBuilder,
        private uow: PlannerUowService,
        @Inject(MAT_DIALOG_DATA) data: any
    ) {
        this.currentTrigger = data;
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        const trig = this.currentTrigger;
        this.triggerFormGroup = this.formBuilder.group({
            milestone: new FormControl(trig.milestone, [
                Validators.required,
                existingMilestoneValidator(this.uow.getAllMilestones())
            ]),
            offset: new FormControl(trig.generationOffset),
            start: new FormControl(trig.triggerStart),
            stop: new FormControl(trig.triggerStop)
        });
        this.triggerFormGroup.statusChanges
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
        this.currentTrigger.entityAspect.rejectChanges();
        this.dialogRef.close();
    }

    saveChanges(): void {
        this.currentTrigger.milestone = this.triggerFormGroup.get(
            'milestone'
        ).value;
        this.currentTrigger.generationOffset = this.triggerFormGroup.get(
            'offset'
        ).value;
        this.dialogRef.close(this.currentTrigger);
    }
}
