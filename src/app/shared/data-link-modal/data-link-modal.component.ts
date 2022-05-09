import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/**
 *
 *
 */
@Component({
  selector: 'app-data-link-modal',
  templateUrl: './data-link-modal.component.html',
  styleUrls: ['./data-link-modal.component.scss'],
})
export class DataLinkModalComponent {
  constructor(public dialogRef: MatDialogRef<DataLinkModalComponent>) {}

  /** Close modal. */
  closeHelpModal(): void {
    this.dialogRef.close();
  }
}
