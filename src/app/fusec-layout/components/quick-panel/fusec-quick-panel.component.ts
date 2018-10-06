import { Component, ViewEncapsulation } from '@angular/core';

@Component({
    selector     : 'fusec-quick-panel',
    templateUrl  : './fusec-quick-panel.component.html',
    styleUrls    : ['./fusec-quick-panel.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FusecQuickPanelComponent {
    date: Date;
    events: any[];
    notes: any[];
    settings: any;

    constructor() {
        // Set the defaults
        this.date = new Date();
        this.settings = {
            notify: true,
            cloud : false,
            retro : true
        };
    }
}
