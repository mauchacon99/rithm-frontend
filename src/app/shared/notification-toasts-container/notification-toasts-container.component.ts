import { Component } from '@angular/core';
/**
 * Container for the toast notifications.
 */
@Component({
  selector: 'app-notification-toasts-container',
  templateUrl: './notification-toasts-container.component.html',
  styleUrls: ['./notification-toasts-container.component.scss']
})
export class NotificationToastsContainerComponent {
  /** Array of Notifications. */
  notifications = [
    {
      title: 'Steve Rogers tagged you in a comment',
      photo: '',
      type: 'comment',
      message: '@Tony Stark please double check the SKU on this new product. Test for 2 lines of text'
    },
    {
      title: 'Tony Stark tagged you in a comment',
      photo: '',
      type: 'comment',
      message: 'My comment.'
    },
    {
      title: 'Rick Grimes tagged you in a comment',
      photo: '',
      type: 'comment',
      message: 'My comment.'
    }
  ];

}
