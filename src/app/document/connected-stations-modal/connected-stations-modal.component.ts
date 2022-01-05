import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ConnectedModalData, ConnectedStationInfo, MoveDocument } from 'src/models';
import { DocumentService } from 'src/app/core/document.service';
import { first } from 'rxjs';
import { ErrorService } from 'src/app/core/error.service';

/**
 * Component for connected stations.
 */
@Component({
  selector: 'app-connected-stations-modal',
  templateUrl: './connected-stations-modal.component.html',
  styleUrls: ['./connected-stations-modal.component.scss'],
})
export class ConnectedStationsModalComponent implements OnInit {
  /** The title Modal. */
  title = 'Where would you like to move this document?';

  /** The Label Select of modal. */
  label = 'Select Station';

  /** The list of previous and following stations in the document. */
  connectedStations: ConnectedStationInfo[] = [];

  /** The Document rithmId. */
  documentRithmId = '';

  /** The Station rithmId. */
  stationRithmId = '';

  /** The selected Station for move document. */
  selectedStation = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: ConnectedModalData,
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {
    this.documentRithmId = data.documentRithmId;
    this.stationRithmId = data.stationRithmId;
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.getConnectedStations();
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   */
  private getConnectedStations(): void {
    this.documentService
      .getConnectedStationInfo(this.documentRithmId, this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (connectedStations) => {
          this.connectedStations = connectedStations.nextStations.concat(
            connectedStations.previousStations
          );
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            'Failed to get connected stations for this document.',
            error,
            false
          );
        },
      });
  }

  /**
   * Move the document from a station to another.
   */
  moveDocument(): void {
    const moveDocument: MoveDocument = {
      fromStationRithmId: this.stationRithmId,
      toStationRithmIds: [this.selectedStation],
      documentRithmId: this.documentRithmId
    };
    this.documentService
      .moveDocument(moveDocument)
      .pipe(first())
      .subscribe({
        error: (error: unknown) => {
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
