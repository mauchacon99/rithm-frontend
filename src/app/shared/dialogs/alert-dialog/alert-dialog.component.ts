import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/models';

/**
 * Reusable component used for displaying an alert dialog.
 */
@Component({
  selector: 'app-alert-dialog',
  templateUrl: './alert-dialog.component.html',
  styleUrls: ['./alert-dialog.component.scss']
})
export class AlertDialogComponent {



  /** The title to be displayed on the alert. */
  title: string;

  /** The alert message to be displayed in the dialog. */
  message: string;

  /** The text to be displayed for the okay button. */
  okButtonText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.title = data.title;
    this.message = data.message;
    this.okButtonText = data.okButtonText ? data.okButtonText : 'OK';
  }

  /**
   * The material color to display for the alert.
   *
   * @returns The material color.
   */
  get materialColor(): 'accent' | 'error' {
    return this.title === 'Error' ? 'error' : 'accent';
  }

}
