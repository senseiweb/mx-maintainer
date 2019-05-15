// import {
//     Component,
//     OnDestroy,
//     OnInit,
//     TemplateRef,
//     ViewChild,
//     ViewEncapsulation
// } from '@angular/core';
// import { MatDialog, MatDialogRef, MatTableDataSource } from '@angular/material';
// import * as _ from 'lodash';
// import { merge, BehaviorSubject, Observable, Subject } from 'rxjs';
// import {
//     distinctUntilKeyChanged,
//     filter,
//     map,
//     switchMap,
//     takeUntil,
//     tap
// } from 'rxjs/operators';

// import { DataSource } from '@angular/cdk/table';
// import { fuseAnimations } from '@fuse/animations';
// import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
// import {
//     AssetTriggerAction,
//     GenerationAsset,
//     TriggerAction
// } from 'app/features/aagt/data';
// import { EntityAction } from 'breeze-client';
// import { PlannerUowService } from '../../planner-uow.service';

// @Component({
//     selector: 'asset-trigger-action-list',
//     templateUrl: './asset-trigger-action-list.component.html',
//     styleUrls: ['./asset-trigger-action-list.component.scss'],
//     encapsulation: ViewEncapsulation.None,
//     animations: fuseAnimations
// })
// export class AssetTriggerActionListComponent implements OnInit, OnDestroy {
//     @ViewChild('dialogContent')
//     dialogContent: TemplateRef<any>;

//     assetTriggerActions: AssetTriggerAction[];
//     user: any;
//     dataSource: AssetTriggerActionDataSource;
//     displayedColumns = [
//         'checkbox',
//         'sequence',
//         'alias',
//         'action',
//         'trigger',
//         'status',
//         'outcome'
//     ];

//     selectedContacts: any[];
//     checkboxes: {};
//     dialogRef: any;
//     confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

//     private unsubscribeAll: Subject<any>;
//     private genAssets: GenerationAsset[];
//     private triggerActions: TriggerAction[];

//     constructor(
//         private planUow: PlannerUowService,
//         public _matDialog: MatDialog
//     ) {
//         // Set the private defaults
//         this.unsubscribeAll = new Subject();
//     }

//     ngOnInit(): void {
//         this.dataSource = new AssetTriggerActionDataSource(this.planUow);
//         // this.planUow.onFilterChange
//         //     .pipe(takeUntil(this.unsubscribeAll))
//         //     .subscribe(fc => {
//         //         const filterData: { alias?: string; milestone?: string } = {};
//         //         if (fc.asset.filterText !== 'all' && fc.asset.filterText) {
//         //             filterData.alias = fc.asset.filterText;
//         //         }
//         //         if (fc.trigger.filterText !== 'all' && fc.trigger.filterText) {
//         //             filterData.milestone = fc.trigger.filterText;
//         //         }
//         //         this.dataSource.filter = JSON.stringify(filterData);
//         //     });

//         // this.dataSource = new MatTableDataSource([datasource]);
//         // this.dataSource.filterPredicate = this.filterPedicate();

//         // this._contactsService.onSelectedContactsChanged
//         //     .pipe(takeUntil(this._unsubscribeAll))
//         //     .subscribe(selectedContacts => {
//         //         for (const id in this.checkboxes) {
//         //             if (!this.checkboxes.hasOwnProperty(id)) {
//         //                 continue;
//         //             }

//         //             this.checkboxes[id] = selectedContacts.includes(id);
//         //         }
//         //         this.selectedContacts = selectedContacts;
//         //     });

//         // this._contactsService.onUserDataChanged
//         //     .pipe(takeUntil(this._unsubscribeAll))
//         //     .subscribe(user => {
//         //         this.user = user;
//         //     });

//         // this._contactsService.onFilterChanged
//         //     .pipe(takeUntil(this._unsubscribeAll))
//         //     .subscribe(() => {
//         //         this._contactsService.deselectContacts();
//         //     });
//     }

//     ngOnDestroy(): void {
//         // Unsubscribe from all subscriptions
//         this.unsubscribeAll.next();
//         this.unsubscribeAll.complete();
//     }

//     editContact(contact): void {
//         // this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
//         //     panelClass: 'contact-form-dialog',
//         //     data: {
//         //         contact: contact,
//         //         action: 'edit'
//         //     }
//         // });
//         // this.dialogRef.afterClosed()
//         //     .subscribe(response => {
//         //         if (!response) {
//         //             return;
//         //         }
//         //         const actionType: string = response[0];
//         //         const formData: FormGroup = response[1];
//         //         switch (actionType) {
//         //             /**
//         //              * Save
//         //              */
//         //             case 'save':
//         //                 this._contactsService.updateContact(formData.getRawValue());
//         //                 break;
//         //             /**
//         //              * Delete
//         //              */
//         //             case 'delete':
//         //                 this.deleteContact(contact);
//         //                 break;
//         //         }
//         //     });
//     }

//     deleteContact(contact): void {
//         this.confirmDialogRef = this._matDialog.open(
//             FuseConfirmDialogComponent,
//             {
//                 disableClose: false
//             }
//         );

//         this.confirmDialogRef.componentInstance.confirmMessage =
//             'Are you sure you want to delete?';

//         // this.confirmDialogRef.afterClosed().subscribe(result => {
//         //     if (result) {
//         //         this._contactsService.deleteContact(contact);
//         //     }
//         //     this.confirmDialogRef = null;
//         // });
//     }

//     onSelectedChange(contactId): void {
//         // this._contactsService.toggleSelectedContact(contactId);
//     }

//     toggleStar(contactId): void {
//         // if (this.user.starred.includes(contactId)) {
//         //     this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
//         // }
//         // else {
//         //     this.user.starred.push(contactId);
//         // }
//         // this._contactsService.updateUserData(this.user);
//     }
// }

