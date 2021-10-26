import { Component } from '@angular/core';

/**
 * Component for roster management.
 */
@Component({
  selector: 'app-roster-management-modal',
  templateUrl: './roster-management-modal.component.html',
  styleUrls: ['./roster-management-modal.component.scss']
})
export class RosterManagementModalComponent {

  /** Array of avatars. */
  rosterMembers = [{ firstName: 'Tyler', lastName: 'Hendrickson' },
    { firstName: 'Natasha ', lastName: 'Romanov' },
    { firstName: 'Clinton ', lastName: 'Barton' },
    { firstName: 'Steve', lastName: 'Rogers' },
    { firstName: 'Victor', lastName: 'Shade' }
  ];
}
