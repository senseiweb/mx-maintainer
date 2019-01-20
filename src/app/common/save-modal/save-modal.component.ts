import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-save-modal',
  templateUrl: './save-modal.component.html',
  styleUrls: ['./save-modal.component.scss']
})
export class SaveModalDialogComponent {
    dialogRef: Observable<any>;

    constructor(public saveDialogRef: MatDialogRef<SaveModalDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) { }

    continue(): void {

    }

}
