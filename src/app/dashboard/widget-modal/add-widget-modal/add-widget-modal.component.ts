import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

/** Dialog Modal for add widgets. */
@Component({
  selector: 'app-add-widget-modal',
  templateUrl: './add-widget-modal.component.html',
  styleUrls: ['./add-widget-modal.component.scss'],
})
export class AddWidgetModalComponent {

  /** Tab Parents selected. */
  tabParentSelect = 0;

  constructor(private dialogRef: MatDialogRef<AddWidgetModalComponent>) {}

  /** Close add widgets modal. */
  closeModal(): void {
    this.dialogRef.close();
  }
}
