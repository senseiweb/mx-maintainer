import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'confirm-delete-modal',
  templateUrl: './confirm-delete-modal.component.html',
  styleUrls: ['./confirm-delete-modal.component.scss']
})
export class ConfirmDeleteModalComponent {
    deleteMessage: string;
    deleteItem: string;

    constructor(private confirmDeleteModalRef: MatDialogRef<ConfirmDeleteModalComponent>,
        @Inject(MAT_DIALOG_DATA) data: any) {
        this.deleteMessage = data.message;
        this.deleteItem = data.item;
    }

    cancel(): void  {
        this.confirmDeleteModalRef.close(false);
    }

    confirmDelete(): void {
        this.confirmDeleteModalRef.close(true);
    }

}
