import { Injectable } from '@angular/core';

/**
 * Service for all behavior in handling, logging, and showing errors.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorService {

  /**
   * Logs an error to the console.
   *
   * @param error The error that was encountered.
   */
  logError(error: Error): void {
    console.error(error);
    // TODO: Add error log reporting using some third-party service
  }

  /**
   * Logs an error and displays a separate message to the user.
   *
   * @param displayMessage The error message to display to the user.
   * @param error The error that was encountered.
   */
  displayError(displayMessage: string, error: Error): void {
    this.logError(error);

    // TODO: Display error
  }

}
