import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GenieUowService } from '../genie-uow.service';
import { Generation, Asset, genStatusEnum } from '../../core';
import { GenerationAsset } from 'app/core/entities/generation-asset';
import { EventEmitter } from 'protractor';

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
  step1completed: boolean;
  step2completed: boolean;
  step3completed: boolean;
  step4completed: boolean;
  genAssetsSelected: Array<GenerationAsset> = [];
  assignedAssets: Array<GenerationAsset>;

  constructor(
    private route: ActivatedRoute,
    private uow: GenieUowService  ) { }

  ngOnInit() {
    this.genId = +this.route.snapshot.paramMap.get('id');
    this.plannedGen = this.uow.planGen(this.genId);
    console.log(this.plannedGen);
    this.isLinear = this.plannedGen.status === genStatusEnum.draft;
    console.log(this.allAssets);
    this.getAlreadyAssignedAssets();
  }

  private getAlreadyAssignedAssets(): void {
    if (this.plannedGen.entityAspect.entityState.isAdded()) { return; }
    this.uow.getAssignedAssets(this.plannedGen.id);
  }

}
