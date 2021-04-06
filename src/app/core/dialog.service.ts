import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AlertDialogComponent } from '../shared/dialogs/alert-dialog/alert-dialog.component';

const DIALOG_WIDTH = '500px';

/**
 * Allows the user to display simple modals/popups to the user.
 */
@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  /**
   * Displays an alert message to the user.
   *
   * @param title The alert title to display on the popup.
   * @param message The message to display to the user.
   * @param okButtonText The text to display for the okay button (defaults to "OK").
   */
  alert(title: string, message: string, okButtonText = 'OK'): void {
    this.dialog.open(AlertDialogComponent, {
      width: DIALOG_WIDTH,
      data: { title, message, okButtonText }
    });
  }

  /**
   * Displays a confirmation popup to the user.
   *
   * @param title The confirmation title to display on the popup.
   * @param message The confirmation message to display to the user.
   * @param okButtonText The text to display for the okay button (defaults to "OK").
   * @param cancelButtonText The text to display for the cancel button (defaults to "Cancel").
   */
  confirm(title: string, message: string, okButtonText = 'OK', cancelButtonText = 'Cancel'): void {
    // TODO
  }

  /**
   * Displays a prompt popup to the user.
   *
   * @param title The prompt title to display on the popup.
   * @param message The message prompt to display to the user.
   * @param okButtonText The text to display for the okay button (defaults to "OK").
   * @param cancelButtonText The text to display for the cancel button (defaults to "Cancel").
   * @param defaultText The default text to to have entered in the prompt (optional).
   */
  prompt(title: string, message: string, okButtonText = 'OK', cancelButtonText = 'Cancel', defaultText?: string): void {
    // TODO
  }
}
