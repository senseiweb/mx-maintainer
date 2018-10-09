import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { FuseNavigationService } from '@fuse/components/navigation/navigation.service';

@Component({
    selector     : 'fusec-vertical-layout-3',
    templateUrl  : './fusec-layout-3.component.html',
    styleUrls    : ['./fusec-layout-3.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FusecVerticalLayout3Component implements OnInit, OnDestroy {
    fuseConfig: any;
    navigation: any;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        _navService: FuseNavigationService,
        private _fuseConfigService: FuseConfigService
    ) {
        // Set the defaults
        this.navigation = _navService.getCurrentNavigation() ;

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
