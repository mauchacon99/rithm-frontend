import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { firstValueFrom } from 'rxjs';
import { DialogData, DialogType } from 'src/models';
import { DialogOptions } from 'src/models/dialog-options';
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
   * @param dialogOptions Options to configure the dialog.
   * @returns A promise upon alert closing.
   */
  async alert(dialogOptions: DialogOptions): Promise<void> {
    const alertData: DialogData = {
      ...dialogOptions,
      type: DialogType.Alert
    };

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: MAX_WIDTH,
      width: dialogOptions.width ? dialogOptions.width : DIALOG_WIDTH,
      data: alertData
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  /**
   * Displays a confirmation dialog to the user.
   *
   * @param dialogOptions Options to configure the dialog.
   * @returns True if the user confirmed, false otherwise.
   */
  async confirm(dialogOptions: DialogOptions): Promise<boolean> {
    const confirmData: DialogData = {
      ...dialogOptions,
      type: DialogType.Confirm
    };

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: MAX_WIDTH,
      width: dialogOptions.width ? dialogOptions.width : DIALOG_WIDTH,
      data: confirmData
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  /**
   * Displays a prompt dialog to the user.
   *
   * @param dialogOptions Options to configure the dialog.
   * @returns `undefined` if the dialog was closed. Otherwise, the entered string will be returned.
   */
  async prompt(dialogOptions: DialogOptions): Promise<string> {
    const promptData: DialogData = {
      ...dialogOptions,
      type: DialogType.Prompt
    };
    promptData.type = DialogType.Prompt;

    const dialogRef = this.dialog.open(DialogComponent, {
      maxWidth: MAX_WIDTH,
      width: dialogOptions.width ? dialogOptions.width : DIALOG_WIDTH,
      data: promptData
    });

    return await firstValueFrom(dialogRef.afterClosed());
  }

  /**
   * Displays the Terms and Conditions modal.
   *
   * @param dialogOptions The dialog information to display.
   * @returns `undefined` if the dialog was closed. Otherwise, the entered string will be returned.
   */
  async terms(dialogOptions: DialogOptions): Promise<boolean> {
    const termsData: DialogData = {
      ...dialogOptions,
      type: DialogType.Terms
    };
    termsData.type = DialogType.Terms;

    const dialogRef = this.dialog.open(DialogComponent, {
      minWidth: '350px',
      width: '70%',
      data: termsData
    });

    return await firstValueFrom(dialogRef.afterClosed());
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
