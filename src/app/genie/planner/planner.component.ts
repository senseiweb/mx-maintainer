import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GenieUowService } from '../genie-uow.service';
import { Generation, Asset } from '../../core';
import { GenerationAsset } from 'app/core/entities/generation-asset';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EventEmitter } from 'protractor';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
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
  allAssets: Array<Asset>;
  assignedAssets: Array<GenerationAsset>;
  isoOperations: Array<{ shortcode: string, displayName: string }>;

  constructor(
    private route: ActivatedRoute,
    private uow: GenieUowService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() {

    this.genId = +this.route.snapshot.paramMap.get('id');
    this.plannedGen = this.uow.planGen(this.genId);
    console.log(this.plannedGen);
    this.isLinear = this.plannedGen.status === 'Draft';
    this.allAssets = this.uow.allAssets;
    this.getAlreadyAssignedAssets();
  }

  private getAlreadyAssignedAssets(): void {
    if (this.plannedGen.entityAspect.entityState.isAdded()) { return; }
    this.uow.getAssignedAssets(this.plannedGen.id);
  }

  assignedAssetModelChange($event: EventEmitter): void {
    console.log($event);
  }

}
