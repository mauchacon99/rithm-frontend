import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from 'src/models';
import { AlertDialogComponent } from '../shared/dialogs/alert-dialog/alert-dialog.component';
import { ConfirmDialogComponent } from '../shared/dialogs/confirm-dialog/confirm-dialog.component';
import { PromptDialogComponent } from '../shared/dialogs/prompt-dialog/prompt-dialog.component';

const DIALOG_WIDTH = '500px';

/**
 * Allows the user to display simple popups to the user.
 */
@Injectable({
  providedIn: 'root'
})
export class PopupService {

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  /**
   * Displays an alert dialog to the user.
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
   * Displays a confirmation dialog to the user.
   *
   * @param dialogData The dialog information to display.
   * @returns True if the user confirmed, false otherwise.
   */
  async confirm(dialogData: DialogData): Promise<boolean> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: DIALOG_WIDTH,
      data: dialogData
    });

    return await dialogRef.afterClosed().toPromise();
  }

  /**
   * Displays a prompt dialog to the user.
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

  /**
   * Displays a snackbar popup at the bottom of the window.
   *
   * @param message The message to display to the user.
   * @param error Whether the snackbar is for an error message. Optional; defaults to `false`, non-error.
   */
  notify(message: string, error = false): void {
    this.snackBar.open(message, 'OK', {
      duration: 3500,
      panelClass: error ? 'snackbar-error' : ''
    });
  }
}
