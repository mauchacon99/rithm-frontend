import { ComponentType } from '@angular/cdk/portal';
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
  /** The station info to display. */
  @Input() station!: DashboardStationData;

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  /** Roster modal component. */
  rosterComponent = RosterModalComponent;

  constructor(private dialog: MatDialog) {}


  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    if (this.station.numberOfWorkers <= 3) {
      this.slices = this.station.numberOfWorkers;
    }
  }

  /**
   * Opens a modal with roster information.
   *
   * @param component The component to open.
   */
  openModal(component: ComponentType<unknown>): void {
    this.dialog.open(component, {
      minWidth: '325px',
      data: { stationName: this.station.stationName, stationId: this.station.rithmId }
    });
  }



}
