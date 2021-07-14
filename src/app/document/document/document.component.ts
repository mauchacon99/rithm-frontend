import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { first } from 'rxjs/operators';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
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

  /** The element for the comment drawer. */
  @ViewChild('commentDrawer', {static: true})
  commentDrawer!: MatDrawer;

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
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService
  ) {
    // TODO: update these
    this.documentId = 'ED6148C9-ABB7-408E-A210-9242B2735B1C';
    this.stationId = 'B9F1132A-6AE8-4701-8EED-B1ECC04D10D0';
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.commentDrawer.open();
    this.getConnectedStations();
    this.getDocumentStationData();
  }

  /**
   * Whether to show the backdrop for the comment and history drawers.
   *
   * @returns Whether to show the backdrop.
   */
  get drawerHasBackdrop(): boolean {
    return this.sidenavDrawerService.drawerHasBackdrop;
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

}
