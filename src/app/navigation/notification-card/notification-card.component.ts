import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

/**
 * Reusable component for notification cards.
 */
@Component({
  selector: 'app-notification-card[title]',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
  animations: [
    trigger('notificationTrigger', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(100%)',
        }),
        animate(
          '600ms',
          style({
            opacity: 1,
            transform: 'translateX(0)',
          })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(
          '500ms',
          style({
            opacity: 0,
            transform: 'translateX(100%)',
          })
        ),
      ]),
    ]),
  ],
})
export class NotificationCardComponent {
  /** The event to dismiss a notification. */
  @Output() dismissEvent: EventEmitter<unknown> = new EventEmitter();

  /** The title for the notification. */
  @Input() title = 'Steven Rogers tagged you in a comment';

  /** The notification message. */
  @Input() message =
    '@Tony Stark please double check the SKU on this new product. Test for 2 lines of text';

  /** Whether the notification has been read. */
  @Input() read = false;

  /** When was the notification sent. */
  @Input() time = '10 minutes ago'; // TODO: this should be passed in as an ISO string, so we should calculate the format

  /** Whether the notification is from the menu. */
  @Input() fromMenu = false;

  /** Users initials for profile photo/icon. */
  @Input() initials = 'SR';

  /** The URL for the profile photo, if any. */
  @Input() photoUrl = ''; // ../../../assets/images/example-profile.jpg

  /** Type of notification. */
  @Input() notificationType = 'comment';

  /** Whether the notification is visible (used to trigger the animate out). */
  isVisible = true;

  /**
   * Dismisses this specific notification.
   */
  dismiss(): void {
    this.isVisible = false;
    this.dismissEvent.emit();
  }

  /**
   * Navigates the user to the specific context for the notification. For example,
   * getting tagged in a comment will bring them to that specific document/station/etc.
   */
  goToContext(): void {
    // TODO: bring the user to the specific context
  }
}
