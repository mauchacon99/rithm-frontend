import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/** Dialog template. */
@Component({
  selector: 'app-add-widget-modal',
  templateUrl: './add-widget-modal.component.html',
  styleUrls: ['./add-widget-modal.component.scss'],
})
export class AddWidgetModalComponent {
  constructor(private dialogRef: MatDialogRef<AddWidgetModalComponent>) {}

  /** Close modal. */
  closeModal(): void {
    this.dialogRef.close();
  }
}
