import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/models';

/**
 * Reusable component used for displaying a prompt dialog.
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  /** The title to display for the prompt dialog. */
  title: string;

  /** The message to display for the prompt message. */
  message: string;

  /** The label to display on the input for the prompt. */
  promptLabel: string | undefined;

  /** The entered value of the prompt input. */
  promptInput: string;

  /** The text to display for the okay button. */
  okButtonText: string;

  /** The text to display for the cancel button. */
  cancelButtonText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.title = data.title;
    this.message = data.message;
    this.promptLabel = data.promptLabel;
    this.promptInput = data.promptInput ? data.promptInput : '';
    this.okButtonText = data.okButtonText ? data.okButtonText : 'OK';
    this.cancelButtonText = data.cancelButtonText ? data.cancelButtonText : 'Cancel';
  }
}
