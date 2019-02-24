import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'confirm-unsaved-modal',
  templateUrl: './confirm-unsaved-data-modal.component.html',
  styleUrls: ['./confirm-unsaved-data-modal.component.scss']
})
export class ConfirmUnsavedDataComponent {

    constructor(private confirmDeleteModalRef: MatDialogRef<ConfirmUnsavedDataComponent>,
        @Inject(MAT_DIALOG_DATA) data: any) {
    }

    cancel(): void  {
        this.confirmDeleteModalRef.close(false);
    }

    confirmDelete(): void {
        this.confirmDeleteModalRef.close(true);
    }

}
