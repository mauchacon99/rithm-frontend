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
  avatars = ['JH','ZT','NR','CB','SR','NL'];
}
