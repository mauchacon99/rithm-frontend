import { Component, Input } from '@angular/core';
import { DashboardStationData } from 'src/models';
import { MatDialog } from '@angular/material/dialog';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';
import { Router } from '@angular/router';

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

  constructor(private dialog: MatDialog, private router: Router) {}

  /** Navigate the user to the stationPage. */
  goToStation(): void {
    this.router.navigate([`/station/${this.station.rithmId}`]);
  }

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
