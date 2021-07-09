import { Component, Input, OnInit } from '@angular/core';
import { DashboardStationData } from 'src/models';
import { RosterModalComponent } from 'src/app/shared/roster-modal/roster-modal.component';
import { MatDialog } from '@angular/material/dialog';

/**
 * Reusable component for all user/roster selection and display.
 */
@Component({
  selector: 'app-roster',
  templateUrl: './roster.component.html',
  styleUrls: ['./roster.component.scss']
})
export class RosterComponent implements OnInit {
  //TODO: find a way to get better parity between different interfaces
  //that might be passed to station. EG: DashboardStationData and DocumentStationInformation.
  //maybe combine into single interface?
  //This would make it easier to implement Roster Component throughout the app.

  /** The station info to display. */
  @Input() station?: DashboardStationData;

  /** The array of users passed to display. */
  @Input() users!: Array<string>;

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  constructor(private dialog: MatDialog) {}

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    if (this.users.length <= 3) {
      this.slices = this.users.length;
    }
  }

  /**
   * Opens a modal with roster information.
   */
  openRosterModal(): void {
    if (this.station) {
      this.dialog.open(RosterModalComponent, {
        minWidth: '325px',
        data: { stationName: this.station.stationName, stationId: this.station.rithmId }
      });
    }
  }



}
