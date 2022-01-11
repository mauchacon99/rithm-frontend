import { Component, Input } from '@angular/core';
import { DashboardStationData } from 'src/models';
import { MatDialog } from '@angular/material/dialog';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';

/**
 * Component for displaying a card with station information on the dashboard.
 */
@Component({
  selector: 'app-station-card[station]',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss'],
})
export class StationCardComponent {
  /** The station info to display. */
  @Input() station!: DashboardStationData;

  constructor(private dialog: MatDialog) {}

  /**
   * Opens Station Docs Modal with document information.
   */
  openDocsModal(): void {
    this.dialog.open(StationDocumentsModalComponent, {
      minWidth: '370px',
      data: {
        stationName: this.station.stationName,
        stationId: this.station.rithmId,
      },
    });
  }
}
