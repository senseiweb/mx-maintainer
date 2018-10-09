import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { GenieUowService } from '../genie-uow.service';
import { Generation } from '../../core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-planner',
  templateUrl: './planner.component.html',
  styleUrls: ['./planner.component.scss']
})
export class PlannerComponent implements OnInit {

  genId: number;
  plannedGen: Generation;
  isLinear: boolean;
  generationInfo: FormGroup;
  triggerInfo: FormGroup;
  isoOperations: Array<{shortcode: string, displayName: string}>;

  constructor(
    private route: ActivatedRoute,
    private uow: GenieUowService
  ) { }

  ngOnInit() {
    this.genId = +this.route.snapshot.paramMap.get('id');
    this.plannedGen = this.uow.planGen(this.genId);
    console.log(this.plannedGen);
    this.isLinear = this.plannedGen.status === 'Draft';
  }

}
