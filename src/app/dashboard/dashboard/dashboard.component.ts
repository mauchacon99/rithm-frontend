import { Component } from '@angular/core';
import { User } from 'src/models';

/**
 * Component for the dashboard screens.
 */
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
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
