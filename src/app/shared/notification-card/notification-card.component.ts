import { Component, EventEmitter, Input, Output } from '@angular/core';
import { trigger,style,animate,transition } from '@angular/animations';

/**
 * Reusable component for notification cards.
 */
@Component({
  selector: 'app-notification-card',
  templateUrl: './notification-card.component.html',
  styleUrls: ['./notification-card.component.scss'],
  animations: [
    trigger('notificationTrigger', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(100%)'
        }),
        animate('600ms',
          style({
            opacity: 1,
            transform: 'translateX(0)'
          })
        ),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate('500ms',
          style({
            opacity: 0,
            transform: 'translateX(100%)'
          })
        )
      ])
    ]),
  ]
})
export class NotificationCardComponent {

  /** Trigger the event to dismiss a notification. */
  @Output() public dismissEvent: EventEmitter<unknown> = new EventEmitter();

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

  /** Used to trigger the animations when entering. */
  @Input() animationTrigger = false;

  /** Used to trigger the animate out. */
  isVisible = false;

  /**
   * Dismisses this specific notification.
   */
  dismiss(): void {
    this.isVisible = true;
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
