import { Component, OnInit } from '@angular/core';
import { Notification } from 'src/models/notification';
/** Notification container component. */
@Component({
  selector: 'app-notification-dashboard-menu-container',
  templateUrl: './notification-menu-container.component.html',
  styleUrls: ['./notification-menu-container.component.scss'],
})
export class NotificationMenuContainerComponent implements OnInit {
  /** Temp array of notifications. */
  notifications: Notification[] = [
    {
      rithmId: '1',
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '10 minutes ago',
      initials: 'SL',
    },
    {
      rithmId: '2',
      title: 'Monica Rambeau tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '20 minutes ago',
      initials: 'MR',
    },
    {
      rithmId: '3',
      title: 'Simon Williams tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '48 minutes ago',
      initials: 'SW',
    },
    {
      rithmId: '4',
      title: 'Victor Shade tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '7 minutes ago',
      initials: 'VS',
    },
    {
      rithmId: '5',
      title: 'Steve Rogers tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '19 minutes ago',
      initials: 'SR',
    },
    {
      rithmId: '6',
      title: 'Clinton Barton tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '51 minutes ago',
      initials: 'CB',
    },
    {
      rithmId: '7',
      title: 'Natasha Romanov tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '1 hour ago',
      initials: 'NR',
    },
  ];

  /** Unread Notifications. */
  unread: Notification[] = [];

  /** Read notifications. */
  read: Notification[] = [];

  /** Sort notifications by read value. */
  ngOnInit(): void {
    this.notifications.forEach((notification) => {
      if (notification.read) {
        this.read.push(notification);
      } else {
        this.unread.push(notification);
      }
    });
  }
}
