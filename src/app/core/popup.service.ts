import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData, DialogType } from 'src/models';
import { DialogComponent } from '../shared/dialog/dialog.component';

const DIALOG_WIDTH = '500px';
const MAX_WIDTH = '1200px';

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
   * @returns A promise upon alert closing.
   */
  async alert(dialogData: DialogData): Promise<void> {
    const alertData = dialogData;
    alertData.type = DialogType.Alert;

    const dialogRef = this.dialog.open(DialogComponent, {
      width: DIALOG_WIDTH,
      data: alertData
    });

    return await dialogRef.afterClosed().toPromise();
  }

  /**
   * Displays a confirmation dialog to the user.
   *
   * @param dialogData The dialog information to display.
   * @returns True if the user confirmed, false otherwise.
   */
  async confirm(dialogData: DialogData): Promise<boolean> {
    const confirmData = dialogData;
    confirmData.type = DialogType.Confirm;

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: MAX_WIDTH,
      width: dialogData.width ? dialogData.width : DIALOG_WIDTH,
      data: confirmData
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
    const promptData = dialogData;
    promptData.type = DialogType.Prompt;

    const dialogRef = this.dialog.open(DialogComponent, {
      width: DIALOG_WIDTH,
      data: promptData
    });

    return await dialogRef.afterClosed().toPromise();
  }

  /**
   * Displays the Terms and Conditions modal.
   *
   * @param dialogData The dialog information to display.
   * @returns `undefined` if the dialog was closed. Otherwise, the entered string will be returned.
   */
  async terms(dialogData: DialogData): Promise<boolean> {
    const termsData = dialogData;
    termsData.type = DialogType.Terms;

    const dialogRef = this.dialog.open(DialogComponent, {
      minWidth: '300px',
      width: '70%',
      data: termsData
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
      panelClass: error ? 'snackbar-error' : 'snackbar' // see in styles.scss
    });
  }
}
