import { Component, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DataSource } from '@angular/cdk/collections';
import { Observable, Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

import { fuseAnimations } from '@fuse/animations';
import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { PlannerUowService } from '../../planner-uow.service';
import { AssetTriggerActionDataSource } from './asset-trigger-action-datasource';
import { GenerationAsset, TriggerAction, AssetTriggerAction } from 'app/aagt/data';

@Component({
    selector     : 'asset-trigger-action-list',
    templateUrl  : './asset-trigger-action-list.component.html',
    styleUrls    : ['./asset-trigger-action-list.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AssetTriggerActionListComponent implements OnInit, OnDestroy
{
    @ViewChild('dialogContent')
    dialogContent: TemplateRef<any>;

    assetTriggerActions: AssetTriggerAction[];
    user: any;
    dataSource: AssetTriggerActionDataSource | null;
    // displayedColumns = ['checkbox', 'sequence', 'alias', 'action', 'trigger', 'status', 'outcome'];
    displayedColumns = ['checkbox', 'sequence', 'alias'];

    selectedContacts: any[];
    checkboxes: {};
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    private unsubscribeAll: Subject<any>;
    private genAssets: GenerationAsset[];
    private triggerActions: TriggerAction[];

    constructor(
        private uow: PlannerUowService,
        public _matDialog: MatDialog
    ) {
        // Set the private defaults
        this.unsubscribeAll = new Subject();
    }

    ngOnInit(): void {
        this.dataSource = new AssetTriggerActionDataSource(this.uow);
        this.uow.onAssetTriggerActionChange
            .pipe(takeUntil(this.unsubscribeAll))
            .subscribe(atas => {
                console.log(atas);
                this.assetTriggerActions = atas;
                this.checkboxes = {};
                atas.map(ata => {
                    this.checkboxes[ata.id] = false;
                })
            });

        // this._contactsService.onSelectedContactsChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(selectedContacts => {
        //         for (const id in this.checkboxes) {
        //             if (!this.checkboxes.hasOwnProperty(id)) {
        //                 continue;
        //             }

        //             this.checkboxes[id] = selectedContacts.includes(id);
        //         }
        //         this.selectedContacts = selectedContacts;
        //     });

        // this._contactsService.onUserDataChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(user => {
        //         this.user = user;
        //     });

        // this._contactsService.onFilterChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(() => {
        //         this._contactsService.deselectContacts();
        //     });
    }

    ngOnDestroy(): void {
        // Unsubscribe from all subscriptions
        this.unsubscribeAll.next();
        this.unsubscribeAll.complete();
    }

    editContact(contact): void {
        // this.dialogRef = this._matDialog.open(ContactsContactFormDialogComponent, {
        //     panelClass: 'contact-form-dialog',
        //     data: {
        //         contact: contact,
        //         action: 'edit'
        //     }
        // });

        // this.dialogRef.afterClosed()
        //     .subscribe(response => {
        //         if (!response) {
        //             return;
        //         }
        //         const actionType: string = response[0];
        //         const formData: FormGroup = response[1];
        //         switch (actionType) {
        //             /**
        //              * Save
        //              */
        //             case 'save':

        //                 this._contactsService.updateContact(formData.getRawValue());

        //                 break;
        //             /**
        //              * Delete
        //              */
        //             case 'delete':

        //                 this.deleteContact(contact);

        //                 break;
        //         }
        //     });
    }

    deleteContact(contact): void {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        // this.confirmDialogRef.afterClosed().subscribe(result => {
        //     if (result) {
        //         this._contactsService.deleteContact(contact);
        //     }
        //     this.confirmDialogRef = null;
        // });

    }

    onSelectedChange(contactId): void {
        // this._contactsService.toggleSelectedContact(contactId);
    }

    toggleStar(contactId): void {
        // if (this.user.starred.includes(contactId)) {
        //     this.user.starred.splice(this.user.starred.indexOf(contactId), 1);
        // }
        // else {
        //     this.user.starred.push(contactId);
        // }

        // this._contactsService.updateUserData(this.user);
    }
}


