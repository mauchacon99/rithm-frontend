import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewChecked,
  EventEmitter,
  Output,
  Input,
  ChangeDetectorRef,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDrawer } from '@angular/material/sidenav';
import { first, takeUntil } from 'rxjs/operators';
import { Subject, forkJoin, lastValueFrom } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentService } from 'src/app/core/document.service';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import {
  DocumentAnswer,
  DocumentStationInformation,
  ConnectedStationInfo,
  DocumentAutoFlow,
  MoveDocument,
} from 'src/models';
import { PopupService } from 'src/app/core/popup.service';
import { UserService } from 'src/app/core/user.service';
import { SubHeaderComponent } from 'src/app/shared/sub-header/sub-header.component';
import { StationService } from 'src/app/core/station.service';

/**
 * Main component for viewing a document.
 */
@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
})
export class DocumentComponent implements OnInit, OnDestroy, AfterViewChecked {
  /** The component for the drawer that houses comments and history. */
  @ViewChild('detailDrawer', { static: true })
  detailDrawer!: MatDrawer;

  /** The component for the subheader component. */
  @ViewChild('subHeaderComponent')
  subHeaderComponent!: SubHeaderComponent;

  /** Whether de container is displayed inside a widget or not. */
  @Input() isWidget = false;

  /** Id for station in widget. */
  @Input() stationRithmIdWidget!: string;

  /** Id for document id widget. */
  @Input() documentRithmIdWidget!: string;

  /** Return to list of the documents only with isWidget. */
  @Output() returnDocumentsWidget = new EventEmitter<{
    /** When click in flow, return to list of documents in widget. */
    isReturnListDocuments: boolean;
    /** When assign new worker, reload list of documents in widget when click to see list. */
    isReloadListDocuments: boolean;
  }>();

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Document form. */
  documentForm: FormGroup;

  /** The information about the document within a station. */
  documentInformation!: DocumentStationInformation;

  /** Document Id. */
  private documentId = '';

  /** Station Id. */
  private stationId = '';

  /** Get Document Name from BehaviorSubject. */
  private documentName = '';

  /** The context of what is open in the drawer. */
  drawerContext = 'comments';

  /** Whether the request to get the document info is currently underway. */
  documentLoading = true;

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = true;

  /** Show or hidden accordion for all field. */
  accordionFieldAllExpanded = false;

  /** To check click SubHeader. */
  clickSubHeader = false;

  /** To check click comment. */
  clickComment = false;

  /** Whether the document allow previous button or not. */
  allowPreviousButton = false;

  /** The list of stations that this document could flow to. */
  forwardStations: ConnectedStationInfo[] = [];

  /** The list of stations that this document came from. */
  previousStations: ConnectedStationInfo[] = [];

  /** The all document answers the document actually. */
  documentAnswer: DocumentAnswer[] = [];

  /** Get flow button name. */
  flowButtonName = '';

  constructor(
    private documentService: DocumentService,
    private stationService: StationService,
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private popupService: PopupService,
    @Inject(ChangeDetectorRef) private changeDetectorR: ChangeDetectorRef,
    private userService: UserService
  ) {
    this.documentForm = this.fb.group({
      documentTemplateForm: this.fb.control(''),
    });
  }

  /**
   * Gets info about the document as well as forward and previous stations for a specific document.
   */
  ngOnInit(): void {
    this.subscribeDrawerContext$();
    this.subscribeDocumentName$();
    this.subscribeDocumentAnswer$();
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
   * Whether to show the backdrop for the comment and history drawers.
   *
   * @returns Whether to show the backdrop.
   */
  get drawerHasBackdrop(): boolean {
    return this.sidenavDrawerService.drawerHasBackdrop;
  }

  /**
   * Is the current user an admin.
   *
   * @returns Validate if user is admin.
   */
  get isUserAdmin(): boolean {
    return this.userService.isAdmin;
  }

  /**
   * Is the current user an owner or an admin for this document.
   *
   * @returns Validate if user is owner or admin of current document.
   */
  get isUserAdminOrOwner(): boolean {
    const ownerDocument = this.documentInformation.stationOwners?.find(
      (owner) => this.userService.user.rithmId === owner.rithmId
    );
    return !!ownerDocument || this.userService.isAdmin;
  }

  /** Subscribe to drawerContext$. */
  private subscribeDrawerContext$(): void {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((context) => {
        this.drawerContext = context;
      });
  }

  /** Subscribe to documentName$. */
  private subscribeDocumentName$(): void {
    this.documentService.documentName$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((documentName) => {
        this.documentName = documentName.baseName;
      });
  }

  /** Subscribe to documentAnswer$. */
  private subscribeDocumentAnswer$(): void {
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
   * Checks after the component views and child views.
   */
  ngAfterViewChecked(): void {
    this.changeDetectorR.detectChanges();
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
   *
   * @param isReturnListDocuments Boolean, when is true, return and reload to the documents list in widget.
   */
  private navigateBack(isReturnListDocuments = false): void {
    // TODO: [RIT-691] Check which page user came from. If exists and within Rithm, navigate there
    // const previousPage = this.location.getState();

    // If no previous page, go to dashboard
    // If is widget return to the documents list
    this.isWidget
      ? this.widgetReloadListDocuments(isReturnListDocuments, false)
      : this.isUserAdmin
      ? this.router.navigateByUrl('map')
      : this.router.navigateByUrl('dashboard');
  }

  /**
   * Emit reload list of documents in station widget.
   *
   * @param isReturnListDocuments Return to list of documents, true to reload list.
   * @param isReloadListDocuments Reload list of documents when click to see list.
   */
  widgetReloadListDocuments(
    isReturnListDocuments: boolean,
    isReloadListDocuments: boolean
  ): void {
    this.returnDocumentsWidget.emit({
      isReturnListDocuments,
      isReloadListDocuments,
    });
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
        next: async (document) => {
          if (document) {
            this.documentInformation = document;
          }
          // Get the allow the previous button for the document.
          this.allowPreviousButton = await lastValueFrom(
            this.stationService.getAllowPreviousButton(this.stationId)
          );
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
      message: `Your changes will be lost and you will return to the ${
        this.isWidget ? 'documents list' : 'dashboard'
      }.`,
      okButtonText: 'Confirm',
      cancelButtonText: 'Close',
      important: true,
    });
    if (response) this.navigateBack();
  }

  /**
   * Check Click Outside Comment.
   *
   * @param clickInside To catch event that verify click comment drawer outside.
   */
  checkClickOutsideComment(clickInside: boolean): void {
    if (
      !clickInside &&
      !this.clickSubHeader &&
      this.sidenavDrawerService.isDrawerOpen
    ) {
      this.sidenavDrawerService.closeDrawer();
      this.subHeaderComponent.activeItem = 'none';
    }
  }

  /**
   * Check click outside sub header.
   *
   * @param clickInside To catch event that verify click comment drawer outside.
   */
  checkClickSubHeader(clickInside: boolean): void {
    this.clickSubHeader = clickInside;
  }

  /**
   * Save document changes with the save button.
   */
  saveDocumentChanges(): void {
    this.documentForm.markAllAsTouched();
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
  saveAnswersFlowDocument(): void {
    this.documentForm.markAllAsTouched();
    this.documentLoading = true;
    this.saveDocumentAnswer();
  }

  /**
   * Save document answers (isolate request).
   */
  private saveDocumentAnswer(): void {
    this.documentService
      .saveDocumentAnswer(
        this.documentInformation.documentRithmId,
        this.documentAnswer
      )
      .pipe(first())
      .subscribe({
        next: () => {
          this.updateDocumentName();
        },
        error: (error: unknown) => {
          this.documentLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end saving answers and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Update document name (isolate request).
   */
  private updateDocumentName(): void {
    this.documentService
      .updateDocumentName(
        this.documentInformation.documentRithmId,
        this.documentName
      )
      .pipe(first())
      .subscribe({
        next: () => {
          this.autoFlowContainer();
        },
        error: (error: unknown) => {
          this.documentLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end updating container's name and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * AutoFlow Container (isolated request).
   */
  private autoFlowContainer(): void {
    const documentAutoFlow: DocumentAutoFlow = {
      stationRithmId: this.documentInformation.stationRithmId,
      documentRithmId: this.documentInformation.documentRithmId,
      // Parameter temporary testMode.
      testMode: false,
    };
    this.documentService
      .autoFlowDocument(documentAutoFlow)
      .pipe(first())
      .subscribe({
        next: (data: string[]) => {
          this.documentLoading = false;
          if (
            !this.isWidget &&
            this.documentInformation.isChained &&
            data.length === 1
          ) {
            this.router
              .navigate(
                [`/document/${this.documentInformation.documentRithmId}`],
                {
                  queryParams: {
                    documentId: this.documentInformation.documentRithmId,
                    stationId: data[0],
                  },
                }
              )
              .then(() => {
                this.getParams();
              });
          } else {
            this.navigateBack();
          }
        },
        error: (error: unknown) => {
          this.documentLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end flowing the container and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Move document flow from current station to previous station.
   */
  async flowDocumentToPreviousStation(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Are you sure?',
      message: '\nYou will be redirected to the dashboard.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    });

    if (confirm) {
      this.documentLoading = true;
      const previousStations: string[] = this.previousStations.map(
        (item) => item.rithmId
      );
      const moveDoc: MoveDocument = {
        fromStationRithmId: this.stationId,
        toStationRithmIds: previousStations,
        documentRithmId: this.documentId,
      };

      this.documentService
        .flowDocumentToPreviousStation(moveDoc)
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
              error,
              false
            );
          },
        });
    }
  }

  /**
   * Get flow button name.
   */
  getFlowButtonName(): void {
    this.stationService
      .getFlowButtonText(this.documentInformation.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (flowButtonText) => {
          this.flowButtonName = flowButtonText || 'Flow';
        },
        error: (error: unknown) => {
          this.flowButtonName = 'Flow';
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
