// import {
//     ChangeDetectorRef,
//     Component,
//     Input,
//     OnDestroy,
//     OnInit
// } from '@angular/core';
// import { Asset, Generation } from 'app/features/aagt/data';
// import { Subject } from 'rxjs';
// import { filter, take, takeUntil } from 'rxjs/operators';
// import { PlannerUowService } from '../../planner-uow.service';

// @Component({
//     selector: 'asset-trigger-sidebar',
//     templateUrl: './asset-trigger-sidebar.component.html',
//     styleUrls: ['./asset-trigger-sidebar.component.scss']
// })
// export class AssetTriggerSidebarComponent implements OnInit, OnDestroy {
//     triggerNames: string[];
//     triggerFilterBy: string;
//     assetFilterBy: string;
//     assetNames: string[];
//     // Private
//     private unsubscribeAll: Subject<any>;

//     constructor(
//         private uow: PlannerUowService,
//         private cdRef: ChangeDetectorRef
//     ) {
//         // Set the private defaults
//         this.unsubscribeAll = new Subject();
//     }

//     ngOnInit(): void {
//         this.assetFilterBy = this.uow.onFilterChange.value.asset.filterText;
//         this.triggerFilterBy = this.uow.onFilterChange.value.trigger.filterText;
//         this.triggerNames = [
//             ...new Set(
//                 this.uow.currentGen.triggers.map(trigger => trigger.milestone)
//             )
//         ];

//         this.uow.onStepperChange
//             .pipe(
//                 filter(stepEvent => stepEvent.selectedIndex === 5),
//                 takeUntil(this.unsubscribeAll)
//             )
//             .subscribe(_ => {
//                 this.cdRef.detectChanges();
//             });
//     }

//     ngOnDestroy(): void {
//         // Unsubscribe from all subscriptions
//         this.unsubscribeAll.next();
//         this.unsubscribeAll.complete();
//     }

//     filterActionsByAsset(alias: string): void {
//         if (!alias) {
//             this.uow.onFilterChange.next({
//                 asset: {
//                     filterText: 'all'
//                 }
//             });
//             this.assetFilterBy = 'all';
//         } else {
//             this.uow.onFilterChange.next({
//                 asset: {
//                     filterText: 'all'
//                 }
//             });
//             this.assetFilterBy = alias;
//         }
//     }

//     filterActionsByTrigger(trigName: string): void {
//         if (!trigName) {
//             this.uow.onFilterChange.next({
//                 trigger: {
//                     filterText: 'all'
//                 }
//             });
//             this.triggerFilterBy = 'all';
//         } else {
//             this.uow.onFilterChange.next({
//                 trigger: {
//                     filterText: trigName
//                 }
//             });
//             this.triggerFilterBy = trigName;
//         }
//     }
// }
