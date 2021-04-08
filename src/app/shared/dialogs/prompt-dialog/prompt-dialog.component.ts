import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogData } from 'src/models';

/**
 * Reusable component used for displaying a prompt dialog.
 */
@Component({
  selector: 'app-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrls: ['./prompt-dialog.component.scss']
})
export class PromptDialogComponent {

  enteredText = '';

  title: string;

  message: string;

  okButtonText: string;

  cancelButtonText: string;

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.title = data.title;
    this.message = data.message;
    this.okButtonText = data.okButtonText;
    this.cancelButtonText = data.cancelButtonText;
  }
}
