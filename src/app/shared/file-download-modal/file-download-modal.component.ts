import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
/**
 * Reusable component to display a modal that allows the user viewing
 * the container (document) to download an uploaded file.
 */
@Component({
  selector: 'app-file-download-modal',
  templateUrl: './file-download-modal.component.html',
  styleUrls: ['./file-download-modal.component.scss'],
})
export class FileDownloadModalComponent {


  constructor(public dialogRef: MatDialogRef<FileDownloadModalComponent>) {}

  /**
   * Close rule Modal.
   */
  closeModal(): void {
    this.dialogRef.close();
  }
}
