import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewChecked,
  ChangeDetectorRef,
} from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { first, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  DocumentAnswer,
  DocumentStationInformation,
  ConnectedStationInfo,
  DocumentAutoFlow,
} from 'src/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PopupService } from 'src/app/core/popup.service';
import { Subject, forkJoin } from 'rxjs';
import { Input } from '@angular/core';

/**
 * Main component for viewing a document.
 */
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit, OnDestroy, AfterViewChecked {
  /** The Document how widget. */
  @Input() isWidget = false;

  /** Id for station in widget. */
  @Input() stationRithmIdWidget!: string;

  /** Id for document id widget. */
  @Input() documentRithmIdWidget!: string;

  /** Document form. */
  documentForm: FormGroup;

  /** The component for the drawer that houses comments and history. */
  @ViewChild('detailDrawer', { static: true })
  detailDrawer!: MatDrawer;

  /** The information about the document within a station. */
  documentInformation!: DocumentStationInformation;

  /** Document Id. */
  private documentId = '';

  /** Station Id. */
  private stationId = '';

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

  /** Get Document Name from BehaviorSubject. */
  private documentName = '';

  /** Show or hidden accordion for all field. */
  accordionFieldAllExpanded = false;

  constructor(
    private documentService: DocumentService,
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private popupService: PopupService,
    private readonly changeDetectorR: ChangeDetectorRef
  ) {
    this.documentForm = this.fb.group({
      documentTemplateForm: this.fb.control(''),
    });

    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((context) => {
        this.drawerContext = context;
      });

    this.documentService.documentName$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((documentName) => {
        this.documentName = documentName.baseName;
      });

    this.documentService.documentAnswer$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((answer) => {
        const answerFound = this.documentAnswer.find(
          (da) => da.questionRithmId === answer.questionRithmId
        );
        if (answerFound === undefined) {
          /** Answer doesn't exists then add it. */
          answer.stationRithmId = this.documentInformation.stationRithmId;
          answer.documentRithmId = this.documentInformation.documentRithmId;
          this.documentAnswer.push(answer);
        } else {
          /** Answer exists then update its value. */
          const answerIndex = this.documentAnswer.indexOf(answerFound);
          this.documentAnswer[answerIndex].value = answer.value;
        }
      });
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    if (!this.isWidget) {
      this.sidenavDrawerService.setDrawer(this.detailDrawer);
      this.getParams();
    } else {
      this.documentId = this.documentRithmIdWidget;
      this.stationId = this.stationRithmIdWidget;
      this.getDocumentStationData();
    }
  }

  /**
   * Checks after the component views and child views.
   */
  ngAfterViewChecked(): void {
    this.changeDetectorR.detectChanges();
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
    this.route.queryParams.pipe(first()).subscribe({
      next: (params) => {
        if (!params.stationId || !params.documentId) {
          this.handleInvalidParams();
        } else {
          this.documentId = params.documentId;
          this.stationId = params.stationId;
          this.getDocumentStationData();
          this.getConnectedStations();
        }
      },
      error: (error: unknown) => {
        this.errorService.displayError(
          "Something went wrong on our end and we're looking into it. Please try again in a little while.",
          error
        );
      },
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
   */
  private getDocumentStationData(): void {
    this.documentLoading = true;
    this.documentService
      .getDocumentInfo(this.documentId, this.stationId)
      .pipe(first())
      .subscribe({
        next: (document) => {
          if (document) {
            this.documentInformation = document;
          }
          this.documentLoading = false;
        },
        error: (error: unknown) => {
          this.navigateBack();
          this.documentLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   */
  private getConnectedStations(): void {
    this.connectedStationsLoading = true;
    this.documentService
      .getConnectedStationInfo(this.documentId, this.stationId)
      .pipe(first())
      .subscribe({
        next: (connectedStations) => {
          this.forwardStations = connectedStations.nextStations;
          this.previousStations = connectedStations.previousStations;
          this.connectedStationsLoading = false;
        },
        error: (error: unknown) => {
          this.navigateBack();
          this.connectedStationsLoading = false;
          this.errorService.displayError(
            'Failed to get connected stations for this document.',
            error,
            false
          );
        },
      });
  }

  /** This cancel button clicked show alert. */
  async cancelDocument(): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Are you sure?',
      message:
        'Your changes will be lost and you will return to the dashboard.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
      important: true,
    });
    if (response) {
      this.router.navigateByUrl('dashboard');
    }
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Save document changes with the save button.
   */
  saveDocumentChanges(): void {
    this.documentLoading = true;
    const requestArray = [
      // Update the document name.
      this.documentService.updateDocumentName(
        this.documentInformation.documentRithmId,
        this.documentName
      ),

      // Save the document answers.
      this.documentService.saveDocumentAnswer(
        this.documentInformation.documentRithmId,
        this.documentAnswer
      ),
    ];

    forkJoin(requestArray)
      .pipe(first())
      .subscribe({
        next: () => {
          this.getDocumentStationData();
        },
        error: (error: unknown) => {
          this.documentLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Save document answers and auto flow.
   */
  autoFlowDocument(): void {
    this.documentLoading = true;
    const documentAutoFlow: DocumentAutoFlow = {
      stationRithmId: this.documentInformation.stationRithmId,
      documentRithmId: this.documentInformation.documentRithmId,
      // Parameter temporary testMode.
      testMode: false,
    };

    const requestArray = [
      // Save the document answers.
      this.documentService.saveDocumentAnswer(
        this.documentInformation.documentRithmId,
        this.documentAnswer
      ),
      // Update the document name.
      this.documentService.updateDocumentName(
        this.documentInformation.documentRithmId,
        this.documentName
      ),

      // Flow a document.
      this.documentService.autoFlowDocument(documentAutoFlow),
    ];

    forkJoin(requestArray)
      .pipe(first())
      .subscribe({
        next: () => {
          this.documentLoading = false;
          this.router.navigateByUrl('dashboard');
        },
        error: (error: unknown) => {
          this.documentLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
