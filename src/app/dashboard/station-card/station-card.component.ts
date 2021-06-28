import { ComponentType } from '@angular/cdk/portal';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { StationDocumentsModalComponent } from 'src/app/shared/station-documents-modal/station-documents-modal.component';

/**
 * Component for displaying a card with station information on the dashboard.
 */
@Component({
  selector: 'app-station-card',
  templateUrl: './station-card.component.html',
  styleUrls: ['./station-card.component.scss']
})
export class StationCardComponent {

  /** Station documents modal component. */
  stationDocsComponent = StationDocumentsModalComponent;

  constructor(private dialog: MatDialog) {}

  /**
   * Opens a modal with document information.
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
