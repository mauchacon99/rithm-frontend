/* eslint-disable @typescript-eslint/no-unused-vars */

/**
 * Mocks methods of the `ErrorService`.
 */
export class MockErrorService {
  /**
   * Logs an error to the console.
   *
   * @param error The error that was encountered.
   */
  logError(error: Error): void {
    return;
  }

  /**
   * Logs an error and displays a separate message to the user.
   *
   * @param displayMessage The error message to display to the user.
   * @param error The error that was encountered.
   * @param important Whether the error is important and requires a dismissal (using an
   * alert). Optional; defaults to `false` (non-important).
   */
  displayError(displayMessage: string, error: Error, important = false): void {
    return;
  }
}
