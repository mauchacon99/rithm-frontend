import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

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
    // TODO
  }

  confirm() {
    // TODO
  }

  prompt() {
    // TODO
  }
}
