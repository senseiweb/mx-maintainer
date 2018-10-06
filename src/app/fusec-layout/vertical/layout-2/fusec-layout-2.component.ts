import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { AagtAppConfig } from 'app/core';

@Component({
    selector     : 'fusec-vertical-layout-2',
    templateUrl  : './fusec-layout-2.component.html',
    styleUrls    : ['./fusec-layout-2.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FusecVerticalLayout2Component implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;


    constructor(
        private _fuseConfigService: FuseConfigService,
        _aagtConfig: AagtAppConfig
    ) {
        // Set the defaults
        this.navigation = _aagtConfig.fuseNavigation;

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        // Subscribe to config changes
        this._fuseConfigService.config
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((config) => {
                this.fuseConfig = config;
            });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}
