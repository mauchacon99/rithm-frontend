import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData, DialogType } from 'src/models';

/**
 * Reusable component used for displaying a prompt dialog.
 */
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss'],
})
export class DialogComponent {
  /** The types of dialogs. */
  readonly dialogType = DialogType;

  /** The type of dialog to display. */
  type: DialogType;

  /** Whether the dialog to show is important and should be highlighted in red. */
  important: boolean;

  /** The title to display for the dialog. */
  title: string;

  /** The message to display in the dialog. */
  message: string;

  /** The text to display for the okay button. */
  okButtonText: string;

  /** The text to display for the cancel button. */
  cancelButtonText: string;

  /** The label to display on the input for the prompt. */
  promptLabel?: string;

  /** The entered value of the prompt input. */
  promptValue?: string;

  /** Show or hide, Agree and cancel button. */
  showAgreeButton?: boolean;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.type = data.type;
    this.title = data.title;
    this.message = data.message;
    this.important = data.important ? data.important : false;
    this.okButtonText = data.okButtonText ? data.okButtonText : 'OK';
    this.cancelButtonText = data.cancelButtonText
      ? data.cancelButtonText
      : 'Cancel';

    if (this.type === DialogType.Prompt) {
      this.promptLabel = data.promptLabel ? data.promptLabel : 'Enter a value';
      this.promptValue = data.promptValue ? data.promptValue : '';
    }
  }

  /**
   * The material color to display for the dialog.
   *
   * @returns The material color.
   */
  get materialColor(): 'accent' | 'error' {
    return this.important ? 'error' : 'accent';
  }
}
