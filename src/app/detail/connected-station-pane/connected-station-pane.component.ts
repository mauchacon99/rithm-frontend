import { Component, OnInit } from '@angular/core';
import { ConnectedStationInfo, ForwardPreviousStationsDocument } from 'src/models';
import { DocumentService } from 'src/app/core/document.service';
import { first } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';
import { ErrorService } from 'src/app/core/error.service';

/**
 * Reusable component for the pane showing the upstream/downstream stations.
 */
@Component({
  selector: 'app-connected-station-pane',
  templateUrl: './connected-station-pane.component.html',
  styleUrls: ['./connected-station-pane.component.scss']
})
export class ConnectedStationPaneComponent implements OnInit {

  constructor(private documentService: DocumentService,
    private errorService: ErrorService) { }

  /** List of forward stations. */
  forwardStations = Array<ConnectedStationInfo>();

  /** List of previous stations. */
  previousStations = Array<ConnectedStationInfo>();

  /** Whether the header data is loading. */
  isLoading = true;

  /** Id of a document. */
  documentId = '';

  /** Id of a station. */
  stationId = '';

  /**
   * Get forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.documentService.getConnectedStationInfo(this.documentId, this.stationId)
      .pipe(first())
      .subscribe((connectedStations) => {
        this.forwardStations = connectedStations.followingStations;
        this.previousStations = connectedStations.previousStations;
      }, (error: HttpErrorResponse) => {
        this.isLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error,
          true
        );
      });
  }

}
