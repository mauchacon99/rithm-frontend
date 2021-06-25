import { ComponentType } from '@angular/cdk/portal';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { RosterModalComponent } from 'src/app/shared/roster-modal/roster-modal.component';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { DashboardStationData } from 'src/models';

/**
 * Component for displaying a card with station information on the dashboard.
 */
@Component({
  selector: 'app-station-card',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss']
})
export class StationCardComponent implements OnInit {
  /** The station info to display. */
  @Input() station!: DashboardStationData;

  /** Set the number of roster members to show when more than 3 members.  */
  slices = 2;

  /** Roster modal component. */
  rosterComponent = RosterModalComponent;

  /** Station documents modal component. */
  stationDocsComponent = StationDocumentsModalComponent;

  constructor(private dialog: MatDialog) {

  }

  /**
   * Set the number of roster members to show when less than 3.
   */
  ngOnInit(): void {
    if (this.station.numberOfWorkers <= 3) {
      this.slices = this.station.numberOfWorkers;
    }
  }

  /**
   * Open a modal with roster or document information.
   *
   * @param componentName Name of the component to open.
   */
  openModal(componentName: ComponentType<unknown>): void {
    this.dialog.open(componentName, {
      minWidth: '325px',
      data: { stationName: this.station.stationName, stationId: this.station.id }
    });
  }

}
