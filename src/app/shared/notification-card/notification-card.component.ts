import { Component } from '@angular/core';

/**
 * Reusable component for notification cards.
 */
@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent {

  /** The title for the notification. */
  title = 'Steven Rogers tagged you in a comment';

  /** The notification message. */
  message = '@Tony Stark please double check the SKU on this new product. it is very long and needs all of your attention as soon as possible';

  /**
   * Dismisses this specific notification.
   */
  dismiss(): void {
    // TODO: dismiss this notification
  }

  /**
   * Navigates the user to the specific context for the notification. For example,
   * getting tagged in a comment will bring them to that specific document/station/etc.
   */
  goToContext(): void {
    // TODO: bring the user to the specific context
  }

}
