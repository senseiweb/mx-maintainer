import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CanDeactivateGuard } from 'app/common/can-deactivate-guard.service';
import { ConfirmUnsavedDataComponent } from 'app/common/confirm-unsaved-data-modal/confirm-unsaved-data-modal.component';
import { genStatusEnum, GenerationAsset } from 'app/features/aagt/data';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PlannerUowService } from './planner-uow.service';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html',
    styleUrls: ['./planner.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlannerComponent implements OnInit, CanDeactivateGuard {
    genId: number;
    isLinear: boolean;
    step1Completed: boolean;
    step2Completed: boolean;
    step3Completed: boolean;
    step4Completed: boolean;
    genAssetsSelected: GenerationAsset[] = [];
    assignedAssets: GenerationAsset[];
    private unsubscribeAll: Subject<any>;

    constructor(
        private route: ActivatedRoute,
        private deactivateDialog: MatDialog,
        private uow: PlannerUowService
    ) {
        this.unsubscribeAll = new Subject();
    }

    canDeactivate(): Observable<boolean> {
        return this.uow.canDeactivatePlaaner;
        // const currentGen = this.uow.currentGen;
        // const isNewGen = this.uow.currentGen.entityAspect.entityState.isAdded();

        // if (isNewGen) {
        //     const hasValidGen = currentGen.entityAspect.validateEntity();
        //     const hasKids = currentGen.triggers || currentGen.generationAssets;

        //     if (hasValidGen && hasKids) {
        //         this.confirmDeleteUnsavedData();
        //     } else {
        //         this.uow.canDeactivatePlaaner.next(true);
        //     }
        // }

        // const newValidGeneration = this.uow.currentGen.entityAspect.entityState.isAdded() &&
        //     this.uow.currentGen.entityAspect.validateEntity();

        // const newGenWithKids = this.uow.currentGen.id < 0

        // if (this.uow.currentGen.id < 0 &&
        //     this.uow.currentGen.entityAspect.validateEntity()) {

        //     }
    }

    ngOnInit() {
        this.genId = this.route.snapshot.params.id;
        this.uow.planGen(this.genId);
        this.isLinear = this.uow.currentGen.genStatus === genStatusEnum.draft;

        this.uow.onStep1ValidityChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(isValid => (this.step1Completed = isValid));
        this.uow.onStep2ValidityChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(isValid => (this.step2Completed = isValid));
        this.uow.onStep3ValidityChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(isValid => (this.step3Completed = isValid));
        this.uow.onStep4ValidityChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(isValid => (this.step4Completed = isValid));
        // this.getAlreadyAssignedAssets();
    }

    onStepChange($event: StepperSelectionEvent): void {
        this.uow.onStepperChange.next($event);
    }

    private confirmDeleteUnsavedData(): void {
        const dialogCfg = new MatDialogConfig();
        this.deactivateDialog
            .open(ConfirmUnsavedDataComponent, dialogCfg)
            .afterClosed()
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(confirmation => {
                this.uow.canDeactivatePlaaner.next(confirmation);
            });
    }

    // private getAlreadyAssignedAssets(): void {
    //     if (this.uow.currentGen.entityAspect.entityState.isAdded()) { return; }
    //     this.uow.getGenerationAssets();
    // }
}
