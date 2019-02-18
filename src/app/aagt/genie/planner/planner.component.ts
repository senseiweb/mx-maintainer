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
    isLinear: boolean;
    step1Completed: boolean;
    step2Completed: boolean;
    step3Completed: boolean;
    step4Completed: boolean;
    genAssetsSelected: GenerationAsset[] = [];
    assignedAssets: GenerationAsset[];

    constructor(
        private route: ActivatedRoute,
        private uow: PlannerUowService) { }

    ngOnInit() {
        this.genId = this.route.snapshot.params.id;
        this.uow.planGen(this.genId);
        this.isLinear = this.uow.currentGen.status === genStatusEnum.draft;
        this.getAlreadyAssignedAssets();
    }

    private getAlreadyAssignedAssets(): void {
        if (this.uow.currentGen.entityAspect.entityState.isAdded()) { return; }
        this.uow.getGenerationAssets();
    }

    onCompleted(id: number, $event: boolean): void {
        switch (id) {
            case 1:
                this.step1Completed = $event;
                break;
            case 2:
                this.step2Completed = $event;
                break;
            case 3:
                this.step3Completed = $event;
                break;
        }

    }
}
