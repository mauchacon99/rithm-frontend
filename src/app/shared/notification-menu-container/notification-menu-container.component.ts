import { Component, OnInit } from '@angular/core';
import { Notifications } from 'src/models/notifications';
/** Notification container component. */
@Component({
  selector: 'app-notification-menu-container',
  templateUrl: './notification-menu-container.component.html',
  styleUrls: ['./notification-menu-container.component.scss']
})
export class NotificationMenuContainerComponent implements OnInit{

  /** Temp array of notifications. */
  notifications = [
    {
      rithmId: '1',
      title: 'Scott Lang tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '10 minutes ago',
      initials: 'SL'
    },
    {
      rithmId: '2',
      title: 'Monica Rambeau tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '20 minutes ago',
      initials: 'MR'
    },
    {
      rithmId: '3',
      title: 'Simon Williams tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '48 minutes ago',
      initials: 'SW'
    },
    {
      rithmId: '4',
      title: 'Victor Shade tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '7 minutes ago',
      initials: 'VS'
    },
    {
      rithmId: '5',
      title: 'Steve Rogers tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '19 minutes ago',
      initials: 'SR'
    },
    {
      rithmId: '6',
      title: 'Clinton Barton tagged you in a comment.',
      type: 'comment',
      read: false,
      time: '51 minutes ago',
      initials: 'CB'
    },
    {
      rithmId: '7',
      title: 'Natasha Romanov tagged you in a comment.',
      type: 'comment',
      read: true,
      time: '1 hour ago',
      initials: 'NR'
    }
  ];

  /** Unread Notifications. */
  unread: Notifications[] = [];

  /** Read notifications. */
  read: Notifications[] = [];

  constructor() {
    // setup...
  }

  /** Sort notifications by read value. */
  ngOnInit(): void {
    this.notifications.forEach(notification => {
      if(notification.read === true) {
        this.read.push(notification);
      } else {
        this.unread.push(notification);
      }
    });
  }


}
