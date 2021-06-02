import { Component } from '@angular/core';
/** Notification container component. */
@Component({
  selector: 'app-notification-menu-container',
  templateUrl: './notification-menu-container.component.html',
  styleUrls: ['./notification-menu-container.component.scss']
})
export class NotificationMenuContainerComponent {

  /** Temp array of notifications. */
  notifications = [
    {
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '10 minutes ago',
      initials: 'SL'
    },
    {
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '20 minutes ago',
      initials: 'SL'
    },
    {
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '48 minutes ago',
      initials: 'SL'
    },
    {
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '7 minutes ago',
      initials: 'SL'
    },
    {
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '19 minutes ago',
      initials: 'SL'
    },
    {
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '51 minutes ago',
      initials: 'SL'
    },
    {
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '1 hour ago',
      initials: 'SL'
    }
  ];

  constructor() {
    // setup...
  }


}
