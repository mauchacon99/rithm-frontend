import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EnvironmentName } from 'src/models';
import { PopupService } from './popup.service';

/**
 * Service for all behavior in handling, logging, and showing errors.
 */
@Injectable({
  providedIn: 'root',
})
export class ErrorService {
  constructor(private popupService: PopupService) {}

  // TODO: add better checking for Error vs unknown type

  /**
   * Logs an error to the console.
   *
   * @param error The error that was encountered.
   */
  logError(error: Error | unknown): void {
    if (
      environment.name === EnvironmentName.Dev ||
      environment.name === EnvironmentName.Test
    ) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
    // TODO: [RIT-680] Add error log reporting using some logging service
  }

  /**
   * Logs an error and displays a separate message to the user.
   *
   * @param displayMessage The error message to display to the user.
   * @param error The error that was encountered.
   * @param important Whether the error is important and requires a dismissal (using an
   * alert). Optional; defaults to `false` (non-important).
   */
  displayError(
    displayMessage: string,
    error: Error | unknown,
    important = true
  ): void {
    this.logError(error);

    if (important) {
      this.popupService.alert({
        title: 'Error',
        message: displayMessage,
        important,
      });
    } else {
      this.popupService.notify(displayMessage, true);
    }
  }
}
