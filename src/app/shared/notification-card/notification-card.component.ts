import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Reusable component for notification cards.
 */
@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss']
})
export class NotificationCardComponent {
  @Output() public onDelete: EventEmitter<any> = new EventEmitter();

  /** The title for the notification. */
  @Input() title = 'Steven Rogers tagged you in a comment';

  /** The notification message. */
  @Input() message = '@Tony Stark please double check the SKU on this new product. Test for 2 lines of text';

  /** Users initials for profile photo/icon. */
  initials = 'SR';

  /** Does the user have a profile photo. */
  hasPhoto = false;

  /** Type of notification. */
  @Input() type = 'comment';

  /**
   * Dismisses this specific notification.
   */
  dismiss(): void {
    // TODO: dismiss this notification
    this.onDelete.emit();
  }

  /**
   * Navigates the user to the specific context for the notification. For example,
   * getting tagged in a comment will bring them to that specific document/station/etc.
   */
  goToContext(): void {
    // TODO: bring the user to the specific context
  }

}
