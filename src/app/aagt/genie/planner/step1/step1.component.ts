import { Component, OnInit, Input} from '@angular/core';
import { Generation, Asset } from 'app/aagt/data';
import { GenieUowService } from 'app/aagt/genie';

@Component({
  selector: 'genie-plan-step1',
  templateUrl: './step1.component.html',
  styleUrls: ['./step1.component.scss']
})
export class Step1Component implements OnInit {

  allAssets: Array<Asset> = [];
  @Input() plannedGen: Generation;
  isoOperations: Array<{ shortcode: string, displayName: string }>;

  constructor(private uow: GenieUowService) { }

  ngOnInit() {
    this.uow.getAllAssets().then(assets =>  this.allAssets = assets);
  }

  assignedAssetModelChange(selectedAssets: Array<number>): void {
    this.plannedGen.numberAssetsRequired = selectedAssets.length;
    console.log(selectedAssets);
  }
}
