import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Generation, GenerationAsset, genStatusEnum } from 'app/aagt/data';
import { PlannerUowService } from './planner-uow.service';

@Component({
    selector: 'app-planner',
    templateUrl: './planner.component.html',
    styleUrls: ['./planner.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class PlannerComponent implements OnInit {

    genId: number;
    plannedGen: Generation;
    isLinear: boolean;
    step1Completed: boolean;
    step2completed: boolean;
    step3completed: boolean;
    step4completed: boolean;
    genAssetsSelected: GenerationAsset[] = [];
    assignedAssets: GenerationAsset[];

    constructor(
        private route: ActivatedRoute,
        private uow: PlannerUowService) { }

    ngOnInit() {
        this.genId = this.route.snapshot.params.id;
        this.plannedGen = this.uow.planGen(this.genId);
        this.isLinear = this.plannedGen.status === genStatusEnum.draft;
        this.getAlreadyAssignedAssets();
    }

    private getAlreadyAssignedAssets(): void {
        if (this.plannedGen.entityAspect.entityState.isAdded()) { return; }
        this.uow.getAssignedAssets(this.plannedGen.id);
    }

    onCompleted($event): void {
        this.step1Completed = $event;
    }
}
