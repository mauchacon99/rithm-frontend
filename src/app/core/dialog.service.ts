import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogData } from 'src/models';
import { AlertDialogComponent } from '../shared/dialogs/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from '../shared/dialogs/prompt-dialog/prompt-dialog.component';

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
   * @param dialogData The dialog information to display.
   */
  alert(dialogData: DialogData): void {
    this.dialog.open(AlertDialogComponent, {
      width: DIALOG_WIDTH,
      data: dialogData
    });
  }

  /**
   * Displays a confirmation popup to the user.
   *
   * @param title The confirmation title to display on the popup.
   * @param message The confirmation message to display to the user.
   * @param okButtonText The text to display for the okay button (defaults to "OK").
   * @param cancelButtonText The text to display for the cancel button (defaults to "Cancel").
   * @returns True if the user confirmed, false otherwise.
   */
  async confirm(title: string, message: string, okButtonText = 'OK', cancelButtonText = 'Cancel'): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: DIALOG_WIDTH,
      data: { title, message, okButtonText, cancelButtonText }
    });

    return await dialogRef.afterClosed().toPromise();
  }

  /**
   * Displays a prompt popup to the user.
   *
   * @param dialogData The dialog information to display.
   * @returns `undefined` if the dialog was closed. Otherwise, the entered string will be returned.
   */
  async prompt(dialogData: DialogData): Promise<string> {
    const dialogRef = this.dialog.open(PromptDialogComponent, {
      width: DIALOG_WIDTH,
      data: dialogData
    });

    return await dialogRef.afterClosed().toPromise();
  }
}
