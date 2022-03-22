import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { RuleModalComponent } from 'src/app/station/rule-modal/rule-modal.component';

/**
 * Reusable component to upload a file from the file-field.
 */
@Component({
  selector: 'app-upload-file-modal',
  templateUrl: './upload-file-modal.component.html',
  styleUrls: ['./upload-file-modal.component.scss'],
})
export class UploadFileModalComponent {
  constructor(public dialogRef: MatDialogRef<RuleModalComponent>) {
    /** */
  }

  /**
   * Close upload file modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
