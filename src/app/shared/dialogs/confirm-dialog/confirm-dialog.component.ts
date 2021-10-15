import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/models';

/**
 * Reusable component used for displaying a confirmation dialog.
 */
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  /** The title to be displayed on the dialog. */
  title: string;

  /** The confirmation message to be displayed in the dialog. */
  message: string;

  /** The text to be displayed for the okay button. */
  okButtonText: string;

  /** The text to be displayed for the cancel button. */
  cancelButtonText: string;

  /** UnitTest data test id in HTML. */
  dataTestId:[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.title = data.title;
    this.message = data.message;
    this.okButtonText = data.okButtonText ? data.okButtonText : 'OK';
    this.cancelButtonText = data.cancelButtonText ? data.cancelButtonText : 'Cancel';
  }

  /**
   * Set param data test id in template.
   *
   * @param user The selected user to remove.
   */
  setDataTestId(message: string){

  }

}
