import { Component, Input } from '@angular/core';

/**
 * Reusable component for displaying the worker roster for a station.
 */
@Component({
  selector: 'app-roster-modal',
  templateUrl: './roster-modal.component.html',
  styleUrls: ['./roster-modal.component.scss']
})
export class RosterModalComponent {
  /** Roster type. */
  @Input() isWorker = true;

  /** Station id. */
  @Input() stationId = 0;

  /** Station name. */
  @Input() stationName = 'Station name';

  /** Temp users list. */
  users = [
    {
      firstName: 'Maggie',
      lastName: 'Rhee',
      email: 'maggie.rhee@email.com',
      initials: 'MR'
    },
    {
      firstName: 'Tyreese',
      lastName: 'Williams',
      email: 'tyreese.williams@email.com',
      initials: 'TW'
    },
    {
      firstName: 'Lizzie',
      lastName: 'Samuels',
      email: 'lizzie.samuels@email.com',
      initials: 'LS'
    },
    {
      firstName: 'Theodore',
      lastName: 'Douglas',
      email: 'theodore.douglas@email.com',
      initials: 'TD'
    },
    {
      firstName: 'Maggie',
      lastName: 'Rhee',
      email: 'maggie.rhee@email.com',
      initials: 'MR'
    }
  ];
}
