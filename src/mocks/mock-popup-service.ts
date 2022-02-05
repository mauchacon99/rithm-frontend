import { DialogOptions } from 'src/models';

/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocks methods of the `PopupService`.
 */
export class MockPopupService {
  /**
   * Displays an alert dialog to the user.
   *
   * @param dialogOptions Options to configure the dialog.
   * @returns A promise upon alert closing.
   */
  async alert(dialogOptions: DialogOptions): Promise<void> {
    return;
  }

  /**
   * Displays a confirmation dialog to the user.
   *
   * @param dialogOptions Options to configure the dialog.
   * @returns True if the user confirmed, false otherwise.
   */
  async confirm(dialogOptions: DialogOptions): Promise<boolean> {
    return true;
  }

  /**
   * Displays a prompt dialog to the user.
   *
   * @param dialogOptions Options to configure the dialog.
   * @returns `undefined` if the dialog was closed. Otherwise, the entered string will be returned.
   */
  async prompt(dialogOptions: DialogOptions): Promise<string> {
    return 'test';
  }

  /**
   * Displays the Terms and Conditions modal.
   *
   * @param dialogOptions The dialog information to display.
   * @returns `undefined` if the dialog was closed. Otherwise, the entered string will be returned.
   */
  async terms(dialogOptions: DialogOptions): Promise<boolean> {
    return true;
  }

  /**
   * Displays a snackbar popup at the bottom of the window.
   *
   * @param message The message to display to the user.
   * @param error Whether the snackbar is for an error message. Optional; defaults to `false`, non-error.
   */
  notify(message: string, error = false): void {
    return;
  }
}
