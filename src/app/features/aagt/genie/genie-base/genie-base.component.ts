import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'genie-base',
    templateUrl: './genie-base.component.html',
    styleUrls: ['./genie-base.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class GenieBaseComponent implements OnInit {

    constructor () { }

    ngOnInit() {
    }

}
