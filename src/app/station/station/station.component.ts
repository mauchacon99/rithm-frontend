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
import { forkJoin, Subject } from 'rxjs';
import { StationInfoHeaderComponent } from 'src/app/detail/station-info-header/station-info-header.component';
import { DocumentService } from 'src/app/core/document.service';
import { DocumentNameField } from 'src/models/document-name-field';
/**
 * Main component for viewing a station.
 */
@Component({
  selector: 'app-station',
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss'],
})
export class StationComponent implements OnInit, OnDestroy {
  /** The component for the drawer that houses comments and history. */
  @ViewChild('drawer', { static: true })
  drawer!: MatDrawer;

  /** The component for the station info header this name station. */
  @ViewChild('stationInfoHeader', { static: false })
  stationInfoHeader!: StationInfoHeaderComponent;

  /** Observable for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

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

  /** Show Hidden accordion field private. */
  accordionFieldPrivateExpanded = false;

  /** The context of what is open in the drawer. */
  drawerContext = 'comments';

  /** Show Hidden accordion all field. */
  accordionFieldAllExpanded = false;

  constructor(
    private stationService: StationService,
    private sidenavDrawerService: SidenavDrawerService,
    private errorService: ErrorService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private documentService: DocumentService,
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
      .subscribe({
        next: (params) => {
          if (!params.stationId) {
            this.handleInvalidParams();
          } else {
            this.getStationInfo(params.stationId);
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
   * @param stationId The id of the station that the document is in.
   */
  private getStationInfo(stationId: string): void {
    this.stationLoading = true;
    this.stationService.getStationInfo(stationId)
      .pipe(first())
      .subscribe({
        next: (stationInfo) => {
          if (stationInfo) {
            this.stationInformation = stationInfo;
          }
          this.stationLoading = false;
        },
        error: (error: unknown) => {
          this.navigateBack();
          this.stationLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Adds selected fieldType to field array.
   *
   * @param fieldType The field to add.
   */
  addQuestion(fieldType: QuestionFieldType): void {
    this.stationInformation.questions.push({
      rithmId: '3j4k-3h2j-hj4j',
      prompt: 'Label',
      instructions: '',
      questionType: fieldType,
      isReadOnly: false,
      isRequired: false,
      isPrivate: false,
      children: [],
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
   * Update the Station.
   *
   * @param stationInformation This Data global, for set data in update request.
   */
  updateStation(stationInformation: StationInformation): void {
    const nameStationChange = this.stationInfoHeader.stationNameForm.value.name;
    stationInformation.name = nameStationChange;
    this.stationLoading = true;

    const petitionsUpdateStation = [
      this.stationService.updateStation(stationInformation).pipe(first()),
      // Second parameter appendedFields temporary.
      this.documentService.updateDocumentAppendedFields(this.stationInformation.rithmId,
        []).pipe(takeUntil(this.destroyed$))
    ];

    forkJoin(petitionsUpdateStation)
      .pipe(takeUntil(this.destroyed$))
      .subscribe({
        next: (stationUpdated) => {
          if (stationUpdated) {
            if (stationUpdated[0]) {
              const dataStationInformation = stationUpdated[0] as StationInformation;
              this.stationInformation = dataStationInformation;
              console.log(this.stationInformation);
            }
          }
          console.log(stationUpdated);
        },
        error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }, complete: () => {
          this.stationLoading = false;
        }
      });

    // petitionsUpdateStation.pipe(
    //   mergeMap(value => value),
    //   takeUntil(this.destroyed$)
    // ).subscribe({
    //   next: (stationUpdated: StationInformation | DocumentNameField[]) => {
    //     console.log(stationUpdated, typeof (stationUpdated));
    //     if (!(stationUpdated instanceof Array)) {
    //       this.stationInformation = stationUpdated as StationInformation;
    //     }
    //   }, error: (error: unknown) => {
    //     this.errorService.displayError(
    //       'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
    //       error
    //     );
    //   }, complete: () => {
    //     this.stationLoading = false;
    //   }
    // });


    // this.stationService.updateStation(stationInformation)
    //   .pipe(first())
    //   .subscribe({
    //     next: (stationUpdated) => {
    //       if (stationUpdated) {
    //         this.stationInformation = stationUpdated;
    //       }
    //       this.stationLoading = false;
    //     },
    //     error: (error: unknown) => {
    //       this.stationLoading = false;
    //       this.errorService.displayError(
    //         'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
    //         error
    //       );
    //     }
    //   });
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

  /**
   * Get the document field name array.
   *
   * @param stationId  The id of station.
   * @param appendedFiles  The appended files.
   */
  updateDocumentAppendedFields(stationId: string, appendedFiles: DocumentNameField[]): void {
    this.documentService.updateDocumentAppendedFields(stationId, appendedFiles)
      .pipe(first())
      .subscribe({
        next: (data) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const documentName = data;
        }, error: (error: unknown) => {
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }
}
