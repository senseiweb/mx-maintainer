// import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
// import { FormControl } from '@angular/forms';
// import { Subject } from 'rxjs';
// import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';

// import { fuseAnimations } from '@fuse/animations';
// import { FuseSidebarService } from '@fuse/components/sidebar/sidebar.service';
// import { ActionItem } from 'app/aagt/data/';
// import { MxFilterTag } from 'app/data';

// @Component({
//     selector: 'genie-action-manager',
//     templateUrl: './action-manager.component.html',
//     styleUrls: ['./action-manager.component.scss'],
//     encapsulation: ViewEncapsulation.None,
//     animations: fuseAnimations
// })
// export class ActionManagerComponent implements OnInit, OnDestroy {
//     hasSelectedActions: boolean;
//     isIndeterminate: boolean;
//     filters: MxFilterTag[];
//     tags: MxFilterTag[];
//     searchInput: FormControl;
//     currentAction: ActionItem;
//     triggerRoute = false;
//     private _unsubscribeAll: Subject<any>;

//     constructor(private _fuseSidebarService: FuseSidebarService,
//         private actionUow: ActionManagerUow) {
//         this.searchInput = new FormControl('');
//         this._unsubscribeAll = new Subject();
//     }

//     ngOnInit() {
//         this.actionUow.onSelectedActionChanged
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe(selectedActions => {

//                 setTimeout(() => {
//                     this.hasSelectedActions = selectedActions.length > 0;
//                     this.isIndeterminate = (selectedActions.length !== this.actionUow.actions.length && selectedActions.length > 0);
//                 }, 0);
//             });

//         this.actionUow.onTagsChanged
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe(tags => {
//                 this.tags = tags.filter(t => !t.isFilter);
//                 this.filters = tags.filter(t => t.isFilter);
//             });

//         this.searchInput.valueChanges
//             .pipe(
//                 takeUntil(this._unsubscribeAll),
//                 debounceTime(300),
//                 distinctUntilChanged()
//             )
//             .subscribe(searchText => {
//                 this.actionUow.onSearchTextChanged.next(searchText);
//             });

//         this.actionUow.onCurrentActionChanged
//             .pipe(takeUntil(this._unsubscribeAll))
//             .subscribe((curr) => {
//                 if (!curr.action) {
//                     this.currentAction = null;
//                 } else {
//                     this.currentAction = curr.action;
//                 }
//             });
//     }

//     ngOnDestroy(): void {
//         // Unsubscribe from all subscriptions
//         this._unsubscribeAll.next();
//         this._unsubscribeAll.complete();
//     }

//     deselectCurrentAction(): void {
//         this.actionUow.onCurrentActionChanged.next({action: null, mode: null});
//     }


//     toggleSelectAll(): void {
//         this.actionUow.toggleSelectAll();
//     }

//     selectActions(filterParameter?, filterValue?): void {
//         this.actionUow.selectActions(filterParameter, filterValue);
//     }

//     deselectActions(): void {
//         this.actionUow.deselectActions();
//     }

//     toggleTagOnSelectedActions(tagId): void {
//         this.actionUow.toggleSelectedAction(tagId);
//     }

//     toggleSidebar(name): void {
//         this._fuseSidebarService.getSidebar(name).toggleOpen();
//     }
// }
