import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { CanDeactivateGuard } from 'app/common/can-deactivate-guard.service';
import { ConfirmUnsavedDataComponent } from 'app/common/confirm-unsaved-data-modal/confirm-unsaved-data-modal.component';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import { GenStatusEnum } from '../../data';
import { PlannerUowService } from './planner-uow.service';

export enum PlannerSteps {
    'GenAsset',
    'AtaList',
    'Summary',
    'TmMgr',
    'TrigAction'
}
export type IStepperModel = {
    [key in PlannerSteps]?: {
        isValid: boolean;
    }
};
@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html',
    styleUrls: ['./planner.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlannerComponent implements OnInit, CanDeactivateGuard {
    genId: number;
    isLinear: boolean;
    stepperStatus: IStepperModel = {} as any;
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
        this.isLinear = this.uow.currentGen.genStatus === GenStatusEnum.Draft;

        // Object.keys(PlannerSteps).forEach(k => {
        //     this.stepperStatus[k] = { isValid: false };
        // });

        this.uow.onStepValidityChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(stepStatus => {
                const key = Object.keys(stepStatus)[0];
                if (!key) {
                    return;
                }
                this.stepperStatus[key] = stepStatus[key];
            });
        // this.getAlreadyAssignedAssets();
    }

    onStepChange = ($event: StepperSelectionEvent) =>
        this.uow.onStepperChange.next($event)

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
