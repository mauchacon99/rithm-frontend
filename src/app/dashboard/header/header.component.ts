import { Component } from '@angular/core';
import { User } from 'src/models';

/**
 * Component for the dashboard overview header.
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  /** A temp user. */
  user: User;

  /** Number of previously started docs. */
  numPrev = 9;

  /** Number of stations user is a member of. */
  numStations = 12;

  constructor() {
    this.user = {
      rithmId: '1',
      firstName: 'Steve',
      lastName: 'Rogers',
      email: 'steve@rogers.com',
      objectPermissions: [],
      groups: [],
      createdDate: ''
    };
  }
}
