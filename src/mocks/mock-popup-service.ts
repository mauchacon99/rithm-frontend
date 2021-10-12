/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { DialogData } from 'src/models';

/**
 * Mocks methods of the `PopupService`.
 */
export class MockPopupService {

  /**
   * Displays an alert dialog to the user.
   *
   * @param dialogData The dialog information to display.
   * @returns A promise upon alert closing.
   */
  async alert(dialogData: DialogData): Promise<void> {}

  /**
   * Displays a confirmation dialog to the user.
   *
   * @param dialogData The dialog information to display.
   * @returns True if the user confirmed, false otherwise.
   */
  async confirm(dialogData: DialogData): Promise<boolean> {
    return true;
  }

  /**
   * Displays a prompt dialog to the user.
   *
   * @param dialogData The dialog information to display.
   * @returns `undefined` if the dialog was closed. Otherwise, the entered string will be returned.
   */
  async prompt(dialogData: DialogData): Promise<string> {
    return 'test';
  }

  /**
   * Displays the Terms and Conditions modal.
   *
   * @param dialogData The dialog information to display.
   * @returns `undefined` if the dialog was closed. Otherwise, the entered string will be returned.
   */
  async terms(dialogData: DialogData): Promise<boolean> {
    return true;
  }

  /**
   * Displays a snackbar popup at the bottom of the window.
   *
   * @param message The message to display to the user.
   * @param error Whether the snackbar is for an error message. Optional; defaults to `false`, non-error.
   */
  notify(message: string, error = false): void {}
}
