import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Component, Inject, OnInit, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { existingMilestoneValidator } from './new-trigger.validator';
import { PlannerUowService } from '../../planner-uow.service';
import { Trigger } from 'app/features/aagt/data';

@Component({
    selector: 'new-trigger-dialog',
    templateUrl: './new-trigger-dialog.html'
})
export class NewTriggerDialogComponent implements OnInit {
    currentTrigger: Trigger;
    triggerFormGroup: FormGroup;
    isNew = false;

    constructor(private dialogRef: MatDialogRef<NewTriggerDialogComponent>, private formBuilder: FormBuilder, private uow: PlannerUowService, @Inject(MAT_DIALOG_DATA) data: any) {
        this.currentTrigger = data;
    }

    ngOnInit(): void {
        const trig = this.currentTrigger;
        this.triggerFormGroup = this.formBuilder.group({
            milestone: new FormControl(trig.milestone, [Validators.required, existingMilestoneValidator(this.uow.getAllMilestones())]),
            offset: new FormControl(trig.generationOffset),
            start: new FormControl(trig.triggerStart),
            stop: new FormControl(trig.triggerStop)
        });
    }

    cancel(): void {
        this.currentTrigger.entityAspect.rejectChanges();
        this.dialogRef.close();
    }

    saveChanges(): void {
        this.currentTrigger.milestone = this.triggerFormGroup.get('milestone').value;
        this.currentTrigger.generationOffset = this.triggerFormGroup.get('offset').value;
        this.dialogRef.close(this.currentTrigger);
    }
}
