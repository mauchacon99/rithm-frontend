import { Component, Inject, OnInit } from '@angular/core';
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
export class ConfirmDialogComponent implements OnInit {

  /** The title to be displayed on the dialog. */
  title: string;

  /** The confirmation message to be displayed in the dialog. */
  message: string;

  /** The text to be displayed for the okay button. */
  okButtonText: string;

  /** The text to be displayed for the cancel button. */
  cancelButtonText: string;

  /** UnitTest data test id in HTML. */
  dataTestId: {
    /** Property in test ok button. */
    okButtonTest: string;
    /** Property in test cancel button. */
    cancelButtonTest: string;
  } = {
      okButtonTest: 'default-button',
      cancelButtonTest: 'default-button'
    };

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData) {
    this.title = data.title;
    this.message = data.message;
    this.okButtonText = data.okButtonText ? data.okButtonText : 'OK';
    this.cancelButtonText = data.cancelButtonText ? data.cancelButtonText : 'Cancel';
  }

  /**
   * Init life cycle component.
   *
   */
  ngOnInit(): void {
    this.setDataTestId();
  }

  /**
   * Set param data test id in template.
   *
   */
  setDataTestId(): void {
    switch (this.okButtonText) {
      case 'Promote':
        this.dataTestId.okButtonTest = 'promote-button';
        this.dataTestId.cancelButtonTest = 'promote-cancel-button';
        break;

      case 'Remove':
        this.dataTestId.okButtonTest = 'remove-button';
        this.dataTestId.cancelButtonTest = 'cancel-button';
        break;
    }
  }

}
