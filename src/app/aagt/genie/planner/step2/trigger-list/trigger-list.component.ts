import { Component, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfirmDialogComponent } from '@fuse/components/confirm-dialog/confirm-dialog.component';
import { FusePerfectScrollbarDirective } from '@fuse/directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';


@Component({
    selector     : 'trigger-list',
    templateUrl  : './trigger-list.component.html',
    styleUrls    : ['./trigger-list.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TriggerListComponent implements OnInit, OnDestroy
{
    trigger: any;
    dialogRef: any;

    @Input()
    list;

    @ViewChild(FusePerfectScrollbarDirective)
    listScroll: FusePerfectScrollbarDirective;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _matDialog: MatDialog
    )
    {
        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }

    ngOnInit(): void
    {
        // this._scrumboardService.onBoardChanged
        //     .pipe(takeUntil(this._unsubscribeAll))
        //     .subscribe(board => {
        //         this.board = board;
        //     });
    }

    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }

    onListNameChanged(newListName): void
    {
        this.list.name = newListName;
    }

    onCardAdd(newCardName): void
    {
        if ( newCardName === '' )
        {
            return;
        }

        // this._scrumboardService.addCard(this.list.id, new Card({name: newCardName}));

        setTimeout(() => {
            this.listScroll.scrollToBottom(0, 400);
        });
    }

    removeList(listId): void
    {
        this.confirmDialogRef = this._matDialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete the list and it\'s all cards?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if ( result )
            {
                // this._scrumboardService.removeList(listId);
            }
        });
    }

    openCardDialog(cardId): void
    {
        // this.dialogRef = this._matDialog.open(ScrumboardCardDialogComponent, {
        //     panelClass: 'scrumboard-card-dialog',
        //     data      : {
        //         cardId: cardId,
        //         listId: this.list.id
        //     }
        // });
        this.dialogRef.afterClosed()
            .subscribe(response => {

            });
    }

    onDrop(ev): void
    {
        // this._scrumboardService.updateBoard();
    }
}
