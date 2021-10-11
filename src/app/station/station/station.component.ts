import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { first, takeUntil } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { StationInformation, QuestionFieldType } from 'src/models';
import { ConnectedStationInfo } from 'src/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StationService } from 'src/app/core/station.service';
import { UtcTimeConversion } from 'src/helpers';
import { Subject } from 'rxjs';

/**
 * Main component for viewing a station.
 */
@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
  providers: [UtcTimeConversion]
})
export class StationComponent implements OnInit, OnDestroy {
  /** The component for the drawer that houses comments and history. */
  @ViewChild('drawer', { static: true })
  drawer!: MatDrawer;

  /** Observable for when the component is destroyed. */
  destroyed$ = new Subject();

  /** Station form. */
  stationForm: FormGroup;

  /** The information about the station. */
  stationInformation!: StationInformation;

  /** Whether the request to get the station info is currently underway. */
  stationLoading = false;

  /** The list of stations that follow this station. */
  forwardStations: ConnectedStationInfo[] = [];

  /** The list of stations that precede this station. */
  previousStations: ConnectedStationInfo[] = [];

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = true;

  /** The Last Updated Date. */
  lastUpdatedDate = '';

  /** Show Hidden accordion field private. */
  accordionFieldPrivateExpanded = false;

  /** The context of what is open in the drawer. */
  drawerContext = 'comments';

  constructor(
    private stationService: StationService,
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private utcTimeConversion: UtcTimeConversion,
  ) {
    this.stationForm = this.fb.group({
      stationTemplateForm: this.fb.control('')
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
    this.sidenavDrawerService.setDrawer(this.drawer);
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
    this.route.params
      .pipe(first())
      .subscribe((params) => {
        if (!params.stationId) {
          this.handleInvalidParams();
        } else {
          this.getStationInfo(params.stationId);
        }
      }, (error: unknown) => {
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
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
   * @param stationId The id of the station that the document is in.
   */
  private getStationInfo(stationId: string): void {
    this.stationLoading = true;
    this.stationService.getStationInfo(stationId)
      .pipe(first())
      .subscribe((stationInfo) => {
        if (stationInfo) {
          this.stationInformation = stationInfo;
        }
        this.stationLoading = false;
      }, (error: unknown) => {
        this.navigateBack();
        this.stationLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Adds selected fieldType to field array.
   *
   * @param fieldType The field to add.
   */
  addQuestion(fieldType: QuestionFieldType): void {
    this.stationInformation.questions.push({
      prompt: 'Label',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: fieldType,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: false,
      isPrivate: false,
      children: [],
    });
  }

  /**
   * Get the last updated date for a specific station.
   *
   * @param stationId The id of the station that the document is in.
   */
  getLastUpdated(stationId: string): void {
    this.stationLoading = true;
    this.stationService.getLastUpdated(stationId)
      .pipe(takeUntil(this.destroyed$))
      .subscribe((updatedDate) => {
        if (updatedDate) {
          this.lastUpdatedDate = this.utcTimeConversion.getElapsedTimeText(
            this.utcTimeConversion.getMillisecondsElapsed(updatedDate));
        }
        this.stationLoading = false;
      }, (error: unknown) => {
        this.stationLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Cleanup method.
   */
   ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   *
   * @param documentId The id of the document for which to retrieve previous stations.
   * @param stationId The id of the station for which to retrieve forward stations.
   */
  // private getConnectedStations(documentId: string, stationId: string): void {
    // TODO: new request for connected stations?

    // this.connectedStationsLoading = true;
    // this.documentService.getConnectedStationInfo(documentId, stationId)
    //   .pipe(first())
    //   .subscribe((connectedStations) => {
    //     this.forwardStations = connectedStations.followingStations;
    //     this.previousStations = connectedStations.previousStations;
    //     this.connectedStationsLoading = false;
    //   }, (error: unknown) => {
    //     this.navigateBack();
    //     this.connectedStationsLoading = false;
    //     this.errorService.displayError(
    //       'Failed to get connected stations for this document.',
    //       error,
    //       false
    //     );
    //   });
  // }
}
