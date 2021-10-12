import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogType } from 'src/models';

/**
 * Reusable component used for displaying a prompt dialog.
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent {

  /** The type of dialog to display. */
  type: DialogType;

  /** The title to display for the prompt dialog. */
  title: string;

  /** The message to display for the prompt message. */
  message: string;

  /** The label to display on the input for the prompt. */
  promptLabel?: string;

  /** The entered value of the prompt input. */
  promptInput?: string;

  /** The text to display for the okay button. */
  okButtonText: string;

  /** The text to display for the cancel button. */
  cancelButtonText?: string;

  /** Show or hide, Agree and cancel button. */
  showAgreeButton?: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,) {
    this.type = data.type!;
    this.title = data.title;
    this.message = data.message;
    this.okButtonText = data.okButtonText ? data.okButtonText : 'OK';

    if (this.type !== DialogType.Alert) {
      this.cancelButtonText = data.cancelButtonText ? data.cancelButtonText : 'Cancel';
    }

    if (this.type === DialogType.Prompt) {
      this.promptLabel = data.promptLabel;
      this.promptInput = data.promptInput ? data.promptInput : '';
    }

    if (this.type === DialogType.Terms) {
      this.showAgreeButton = data.showAgreeButton ? data.showAgreeButton : false;
    }
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
