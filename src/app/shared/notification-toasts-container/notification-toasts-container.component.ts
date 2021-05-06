import { Component, OnInit } from '@angular/core';
/**
 * Container for the toast notifications.
 */
@Component({
  selector: 'app-notification-toasts-container',
  templateUrl: './notification-toasts-container.component.html',
  styleUrls: ['./notification-toasts-container.component.scss']
})
export class NotificationToastsContainerComponent implements OnInit {
  /** Array of Notifications. */
  notifications = [
    {
      title: 'Steve Rogers tagged you in a comment',
      photo: '',
      type: 'comment',
      message: '@Tony Stark please double check the SKU on this new product. Test for 2 lines of text'
    }
  ];

  /** Additional notification. */
  comment1 = {
    title: 'Tony Stark tagged you in a comment',
    photo: '',
    type: 'comment',
    message: 'My comment.'
  };

  /** Additional notification. */
  comment2 = {
    title: 'Rick Grimes tagged you in a comment',
    photo: '',
    type: 'comment',
    message: 'My comment.'
  };

  /** Trigger used for the animations. */
  trigger = true;

  /**
   * Delay adding two additional notifications.
   */
  ngOnInit(): void {
    setTimeout(() => {
      this.notifications.push(this.comment1);
    }, 1000);

    setTimeout(() => {
      this.notifications.push(this.comment2);
    }, 2000);
  }

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
