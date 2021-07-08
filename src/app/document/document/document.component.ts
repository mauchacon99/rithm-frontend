import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { ConnectedStationInfo } from 'src/models';

/**
 * Main component for viewing a document.
 */
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {

  /** The id of the document that is being viewed. */
  private documentId: string;

  /** The id of the station that this document is in. */
  private stationId: string;

  /** List of forward stations. */
  forwardStations: ConnectedStationInfo[] = [];

  /** List of previous stations. */
  previousStations: ConnectedStationInfo[] = [];

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService
  ) {
    // TODO: update these
    this.documentId = 'CEF8BC19-6308-4E8D-A254-DC67EC84530C';
    this.stationId = 'AA6AB2CD-D721-4686-B6DB-1BADD9FAE283';
  }

  /**
   * Get forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.getConnectedStations();
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   */
  private getConnectedStations(): void {
    this.connectedStationsLoading = true;
    this.documentService.getConnectedStationInfo(this.documentId, this.stationId)
    .pipe(first())
    .subscribe((connectedStations) => {
      this.forwardStations = connectedStations.followingStations;
      this.previousStations = connectedStations.previousStations;
      this.connectedStationsLoading = false;
    }, (error) => {
      this.connectedStationsLoading = false;
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error,
        true
      );
    });
  }

}
