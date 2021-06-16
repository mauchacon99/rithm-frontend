import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RosterModalComponent } from 'src/app/shared/roster-modal/roster-modal.component';

/**
 * Component for displaying a card with station information on the dashboard.
 */
@Component({
  selector: 'app-station-card',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss']
})
export class StationCardComponent implements OnInit {
  /** The name of the station. */
  @Input() stationName = '';

  /** Total number of documents in the station. */
  @Input() totalDocs = 0;

  /** Members initials of the station worker roster. */
  @Input() roster = Array<string>();

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  constructor(public dialog: MatDialog) {

  }

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    if (this.roster.length <= 3) {
      this.slices = this.roster.length;
    }
  }

  /**
   * Open the roster.
   */
  openRosterModal(): void {
    // TODO: RIT-428 Send Station info to Roster modal component.
    this.dialog.open(RosterModalComponent, {
      minWidth: '325px'
    });
  }

}
