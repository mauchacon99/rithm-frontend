import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { first, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DocumentAnswer, DocumentStationInformation, ConnectedStationInfo } from 'src/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PopupService } from 'src/app/core/popup.service';
import { Subject } from 'rxjs';

/**
 * Main component for viewing a document.
 */
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit, OnDestroy {
  /** Document form. */
  documentForm: FormGroup;

  /** The component for the drawer that houses comments and history. */
  @ViewChild('detailDrawer', { static: true })
  detailDrawer!: MatDrawer;

  /** The information about the document within a station. */
  documentInformation!: DocumentStationInformation;

  /** Document Id. */
  private documentId = '';

  /** Whether the request to get the document info is currently underway. */
  documentLoading = true;

  /** The list of stations that this document could flow to. */
  forwardStations: ConnectedStationInfo[] = [];

  /** The list of stations that this document came from. */
  previousStations: ConnectedStationInfo[] = [];

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = true;

  /** The context of what is open in the drawer. */
  drawerContext = 'comments';

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** The all document answers the document actually. */
  documentAnswer: DocumentAnswer[] = [];

  constructor(
    private documentService: DocumentService,
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private popupService: PopupService
  ) {
    this.documentForm = this.fb.group({
      documentTemplateForm: this.fb.control('')
    });

    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((context) => {
        this.drawerContext = context;
      });
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.sidenavDrawerService.setDrawer(this.detailDrawer);
    this.getParams();
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
   * Attempts to retrieve the document info from the query params in the URL and make the requests.
   */
  private getParams(): void {
    this.route.queryParams
      .pipe(first())
      .subscribe({
        next: (params) => {
          if (!params.stationId || !params.documentId) {
            this.handleInvalidParams();
          } else {
            this.documentId = params.documentId;
            this.getDocumentStationData(params.documentId, params.stationId);
            this.getConnectedStations(params.documentId, params.stationId);
          }
        }, error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Navigates the user back to dashboard and displays a message about the invalid params.
   */
  private handleInvalidParams(): void {
    this.navigateBack();
    this.errorService.displayError(
      'The link you followed is invalid. Please double check the URL and try again.',
      new Error('Invalid params for document')
    );
  }

  /**
   * Navigates the user back to the dashboard page.
   */
  private navigateBack(): void {
    // TODO: [RIT-691] Check which page user came from. If exists and within Rithm, navigate there
    // const previousPage = this.location.getState();

    // If no previous page, go to dashboard
    this.router.navigateByUrl('dashboard');
  }

  /**
   * Get data about the document and station the document is in.
   *
   * @param documentId The id of the document for which to get data.
   * @param stationId The id of the station that the document is in.
   */
  private getDocumentStationData(documentId: string, stationId: string): void {
    this.documentLoading = true;
    this.documentService.getDocumentInfo(documentId, stationId)
      .pipe(first())
      .subscribe({
        next: (document) => {
          if (document) {
            this.documentInformation = document;
          }
          this.documentLoading = false;
        }, error: (error: unknown) => {
          this.navigateBack();
          this.documentLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   *
   * @param documentId The id of the document for which to retrieve previous stations.
   * @param stationId The id of the station for which to retrieve forward stations.
   */
  private getConnectedStations(documentId: string, stationId: string): void {
    this.connectedStationsLoading = true;
    this.documentService.getConnectedStationInfo(documentId, stationId)
      .pipe(first())
      .subscribe({
        next: (connectedStations) => {
          this.forwardStations = connectedStations.followingStations;
          this.previousStations = connectedStations.previousStations;
          this.connectedStationsLoading = false;
        }, error: (error: unknown) => {
          this.navigateBack();
          this.connectedStationsLoading = false;
          this.errorService.displayError(
            'Failed to get connected stations for this document.',
            error,
            false
          );
        }
      });
  }

  /** This cancel button clicked show alert. */
  async cancelDocument(): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Are you sure?',
      message: 'Your changes will be lost and you will return to the dashboard.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
      important: true,
    });
    if (response) {
      this.router.navigateByUrl('dashboard');
    }
  }

  /**
   * Update the document name.
   */
  private updateDocumentName(): void {
    this.documentLoading = true;
    const newDocumentName = 'Provisional Name while BSubject is done';
    this.documentService.updateDocumentName(this.documentInformation.documentRithmId, newDocumentName)
      .pipe(first())
      .subscribe({
        next: () => {
          this.documentLoading = false;
        },
        error: (error: unknown) => {
          this.documentLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Save the document answers.
   *
   * @param answerDocument The answers so document.
   */
  saveAnswerToDocument(answerDocument: DocumentAnswer[]): void {
    this.documentService.saveAnswerToDocument(this.documentInformation.documentRithmId, answerDocument)
      .pipe(first())
      .subscribe({
        next: (docAnswers) => {
          if (docAnswers) {
            this.documentAnswer = docAnswers;
          }
          this.documentLoading = false;
        }, error: (error: unknown) => {
          this.documentLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }
}
