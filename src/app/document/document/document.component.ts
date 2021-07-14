import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { DocumentStationInformation } from 'src/models';
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

  /** Document information. */
  documentInformation!: DocumentStationInformation;

  /** Whether the stations are being loaded. */
  documentLoading = false;

  /** List of forward stations. */
  forwardStations: ConnectedStationInfo[] = [];

  /** List of previous stations. */
  previousStations: ConnectedStationInfo[] = [];

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = false;

  constructor(
    private documentService: DocumentService,
    private errorService: ErrorService,
    private route: ActivatedRoute
  ) {
    // TODO: update these
    this.documentId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    this.stationId = 'B9F1132A-6AE8-4701-8EED-B1ECC04D10D0';
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.getParams();
    this.getConnectedStations();
    this.getDocumentStationData();
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   */
  private getConnectedStations(): void {
    this.connectedStationsLoading = true;
    console.log(this.stationId);
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

  /**
   * Get data about the document and station the document is in.
   */
  private getDocumentStationData(): void {
    this.documentService.getDocumentInfo(this.documentId, this.stationId, 'Worker')
    .pipe(first())
    .subscribe((document) => {
      if (document) {
        this.documentInformation = document;
      }
      this.documentLoading = false;
    }, (error: HttpErrorResponse) => {
      this.documentLoading = false;
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error,
        true
      );
    });
  }

  /**
   * CC.
   */
   private getParams(): void {
    this.route.queryParams
    .pipe(first())
    .subscribe((params) => {
      this.stationId = params.stationId;
      //this.documentId = params.documentId;
      //console.log(params);
    }, (error: HttpErrorResponse) => {
      this.documentLoading = false;
      this.errorService.displayError(
        'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
        error,
        true
      );
    });
   }

}
