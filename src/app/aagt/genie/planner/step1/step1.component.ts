import { Component, OnInit, Input} from '@angular/core';
import { Generation, Asset } from 'app/aagt/data';

@Component({
  selector: 'genie-plan-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  allAssets: Asset[] = [];
  @Input() plannedGen: Generation;
  isoOperations: Array<{ shortcode: string, displayName: string }>;
  genAssetsSelected = [];
  constructor() { }

  ngOnInit() {
    // this.uow.getAllAssets().then(assets =>  this.allAssets = assets);
  }

  assignedAssetModelChange(selectedAssets: number[]): void {
    this.plannedGen.numberAssetsRequired = selectedAssets.length;
    console.log(selectedAssets);
  }
}
