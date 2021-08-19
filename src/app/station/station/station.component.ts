import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ErrorService } from 'src/app/core/error.service';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { DocumentStationInformation, StationInformation, Question, QuestionFieldType } from 'src/models';
import { ConnectedStationInfo } from 'src/models';
import { FormBuilder, FormGroup } from '@angular/forms';
import { StationService } from 'src/app/core/station.service';

/**
 * Main component for viewing a station.
 */
@Component({
  selector: 'app-station[stationInformation]',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent implements OnInit {
  /** Document form. */
  documentForm: FormGroup;

  /** The component for the drawer that houses comments and history. */
  @ViewChild('detailDrawer', {static: true})
  detailDrawer!: MatDrawer;

  /** The information about the station. */
  stationInformation!: StationInformation | DocumentStationInformation;

  /** Whether the request to get the document info is currently underway. */
  documentLoading = false;

  /** The list of stations that this document could flow to. */
  forwardStations: ConnectedStationInfo[] = [];

  /** The list of stations that this document came from. */
  previousStations: ConnectedStationInfo[] = [];

  /** Whether the request to get connected stations is currently underway. */
  connectedStationsLoading = true;

  /** Fake fields, TODO: remove. */
  fakeFields: Question[] = [
    {
      prompt: 'Instructions',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.LongText,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: false,
      isPrivate: false
    },
    {
      prompt: 'Label',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.ShortText,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: false,
      isPrivate: false
    },
    {
      prompt: 'Fake question 7',
      instructions: '',
      questionType: {
        rithmId: '',
        typeString: QuestionFieldType.Select,
        validationExpression: '.+'
      },
      isReadOnly: false,
      isRequired: true,
      isPrivate: false,
      options: [
        {
          value: 'Required field',
          isSelected: true
        }]
    },
  ];

  constructor(
    private stationService: StationService,
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {
    this.documentForm = this.fb.group({
      documentTemplateForm: this.fb.control('')
    });
    //TODO: remove temporary mock data.
    this.stationInformation = {
      rithmId: '',
      name: 'Station name',
      instructions: '',
      dueDate: '',
      nextStations: [],
      previousStations: [],
      supervisors: [
        {
          userRithmId: '',
          firstName: 'Tyler',
          lastName: 'H',
          email: '',
          isAssigned: true
        },
        {
          userRithmId: '',
          firstName: 'Austin',
          lastName: 'B',
          email: '',
          isAssigned: true
        },
      ],
      workers: [
        {
          userRithmId: '',
          firstName: 'Harrison',
          lastName: 'K',
          email: '',
          isAssigned: true
        },
        {
          userRithmId: '',
          firstName: 'Adarsh',
          lastName: 'A',
          email: '',
          isAssigned: true
        },
        {
          userRithmId: '',
          firstName: 'Harrison',
          lastName: 'K',
          email: '',
          isAssigned: true
        },
        {
          userRithmId: '',
          firstName: 'Adarsh',
          lastName: 'A',
          email: '',
          isAssigned: true
        },
      ],
      createdByRithmId: '',
      createdDate: '',
      updatedByRithmId: '',
      updatedDate: '',
      questions: [],
    };

    this.documentInformation = {
      documentName: 'Metroid Dread',
      documentPriority: 5,
      documentRithmId:'E204F369-386F-4E41',
      currentAssignedUser: 'NS',
      flowedTimeUTC: '1943827200000',
      lastUpdatedUTC: '1943827200000',
      stationId: 'ED6148C9-ABB7-408E-A210-9242B2735B1C',
      stationName: 'Development',
      stationPriority: 2,
      numberOfSupervisors: 7,
      supervisorRoster: [],
      numberOfWorkers: 7,
      workerRoster: [],
      questions: []
    };
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
    this.route.params
      .pipe(first())
      .subscribe((params) => {
        if (!params.stationId) {
          this.handleInvalidParams();
        } else {
          this.getStationInfo(params.stationId);
          // this.getConnectedStations('FCB90EFE-5188-43A9-8C42-2D74D9E81AB1', 'e5db902c-926f-428e-a89e-fbab43097f6c');
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
  // eslint-disable-next-line
  private getStationInfo(stationId: string): void {
    this.documentLoading = true;
    this.stationService.getStationInfo(stationId)
      .pipe(first())
      .subscribe(() => {
        // if (document) {
        //   this.documentInformation = document;
        // }
        this.documentLoading = false;
      }, (error: unknown) => {
        this.navigateBack();
        this.documentLoading = false;
        this.errorService.displayError(
          'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
          error
        );
      });
  }

  /**
   * Retrieves a list of the connected stations for the given document.
   *
   * @param documentId The id of the document for which to retrieve previous stations.
   * @param stationId The id of the station for which to retrieve forward stations.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  private getConnectedStations(documentId: string, stationId: string): void {
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
  }
}
