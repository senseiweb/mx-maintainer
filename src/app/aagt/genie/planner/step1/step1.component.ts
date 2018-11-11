import { Component, OnInit, Input } from '@angular/core';
import { Generation, Asset } from 'app/aagt/data';
import { GenieUowService } from '../../genie-uow.service';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

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
    step1FormGroup: FormGroup;

    constructor(private uow: GenieUowService,
    private formBuilder: FormBuilder) { }

    ngOnInit() {
        this.uow.getAllAssets().then(assets => this.allAssets = assets);
        this.step1FormGroup = this.createStep1Form();
    }

    createStep1Form(): FormGroup {
        const stp = this.plannedGen;
        return this.formBuilder.group({
            title: new FormControl(stp.title),
            active: new FormControl(stp.active),
            iso: new FormControl(stp.iso),
            numberAssetsRequired: new FormControl(stp.numberAssetsRequired),
            startDt: new FormControl(stp.startDateTime),
            stopDt: new FormControl(stp.stopDateTime)
        });
    }

    assignedAssetModelChange(selectedAssets: number[]): void {
        this.plannedGen.numberAssetsRequired = selectedAssets.length;
        console.log(selectedAssets);
    }
}
