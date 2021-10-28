import { Component, Input, OnInit } from '@angular/core';
import { RosterModalComponent } from 'src/app/shared/roster-modal/roster-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { StationRosterMember } from 'src/models';
import { RosterManagementModalComponent } from '../roster-management-modal/roster-management-modal.component';

/**
 * Reusable component for all user/roster selection and display.
 */
@Component({
  selector: 'app-roster[rosterMembers][rosterSize][stationName][stationId][isWorker]',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  //TODO: Decide if it would be better to create a model specifically for displayed rosters instead of using so many inputs.

  /** The list of members on the roster. */
  @Input() rosterMembers!: StationRosterMember[];

  /** The roster size. */
  @Input() rosterSize!: number;

  /** Station name. Needed for openRosterModal. */
  @Input() stationName!: string;

  /** Station ID. Needed for openRosterModal. */
  @Input() stationId!: string;

  /** Determines if roster is a worker or supervisor roster. Needed for openRosterModal. */
  @Input() isWorker!: boolean;

  /** Determines if this is a roster being viewed in edit mode. */
  @Input() editMode?: boolean;

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  constructor(private dialog: MatDialog) {}

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    if (this.rosterSize <= 3) {
      this.slices = this.rosterSize;
    }
  }

  /**
   * Opens a modal with roster information.
   */
  openRosterModal(): void {
    this.dialog.open(RosterModalComponent, {
      minWidth: '325px',
       data: { stationName: this.stationName, stationId: this.stationId, isWorker: this.isWorker}
    });
  }

  /**
   * Opens a modal with roster management.
   */
  openManagementRosterModal(): void {
    this.dialog.open(RosterManagementModalComponent, {
      panelClass: ['md:w-4/5','w-full'],
      maxWidth: '90vW',
       data: { stationId: this.stationId }
    });
  }
}
