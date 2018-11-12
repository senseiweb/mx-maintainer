import { Component, OnInit, Input, Output } from '@angular/core';
import { Generation } from 'app/aagt/data';

@Component({
    selector: 'genie-plan-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss']
})
export class Step2Component implements OnInit {
    @Input() plannedGen: Generation;

    constructor() { }

    ngOnInit() {
    }

}
