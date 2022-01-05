import { Component } from '@angular/core';
/**
 * Container for the toast notifications.
 */
@Component({
  selector: 'app-notification-toasts-container',
  templateUrl: './notification-toasts-container.component.html',
  styleUrls: ['./notification-toasts-container.component.scss'],
})
export class NotificationToastsContainerComponent {
  /** Array of Notifications. */
  notifications:
    | {
        /** Tittle toast. */
        title: string;
        /** Photo toast. */
        photo: string;
        /** Type toast. */
        type: string;
        /** Message toast. */
        message: string;
      }[]
    | [] = [];

  /**
   * Remove a notification from the array.
   *
   * @param index The notification to remove.
   */
  removeNotification(index: number): void {
    setTimeout(() => {
      this.notifications.splice(index, 1);
    }, 1000);
  }
}
