import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UtcTimeConversion } from 'src/helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import { DocumentGenerationStatus, MapItemStatus, MapMode, StationInfoDrawerData, StationInformation } from 'src/models';
import { PopupService } from 'src/app/core/popup.service';
import { MatRadioChange } from '@angular/material/radio';

/**
 * Component for info station.
 */
@Component({
  selector: 'app-station-info-drawer',
  templateUrl: './station-info-drawer.component.html',
  styleUrls: ['./station-info-drawer.component.scss'],
  providers: [UtcTimeConversion]
})

export class StationInfoDrawerComponent implements OnInit, OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Whether the request to get the station info is currently underway. */
  stationLoading = false;

  /** Loading in last updated section. */
  lastUpdatedLoading = false;

  /** Loading in the document generation section. */
  docGenLoading = false;

  /** Use to determinate generation of document. */
  showDocumentGenerationError = false;

  /** Type of user looking at a document. */
  type: 'admin' | 'super' | 'worker';

  /** Is component viewed in station edit mode. */
  editMode = false;

  /** Station information object passed from parent. */
  stationInformation!: StationInformation;

  /** Edit Mode. */
  stationName = '';

  /** Notes for the station. */
  stationNotes = '';

  /** If component is being viewed on the map, what mode is the map in? */
  mapMode?: MapMode;

  /** If component is being viewed on the map, what status does the station have? */
  stationStatus?: MapItemStatus;

  /** Station name form. */
  stationNameForm: FormGroup;

  /** The Last Updated Date. */
  lastUpdatedDate = '';

  /** Status by default the document in station. */
  stationDocumentGenerationStatus: DocumentGenerationStatus = DocumentGenerationStatus.None;

  /** Color message LastUpdated. */
  colorMessage = '';

  /** Whether the station drawer is opened from map or not. */
  openedFromMap = false;

  /** Allowing access to all MapMode enums in HTML.*/
  mapModeEnum = MapMode;

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private fb: FormBuilder,
    private stationService: StationService,
    private utcTimeConversion: UtcTimeConversion,
    private errorService: ErrorService,
    private route: ActivatedRoute,
    private popupService: PopupService,
    private router: Router
  ) {
    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        const dataDrawer = data as StationInfoDrawerData;
        if (dataDrawer) {
          this.editMode = dataDrawer.editMode;
          this.stationInformation = dataDrawer.stationInformation as StationInformation;
          this.stationName = dataDrawer.stationName;
          this.mapMode = dataDrawer.mapMode;
          this.stationStatus = dataDrawer.stationStatus;
          this.openedFromMap = dataDrawer.openedFromMap;
        }
      });

    this.type = this.userService.user.role === 'admin' ? this.userService.user.role : 'worker';
    this.stationNameForm = this.fb.group({
      name: [this.stationName]
    });
  }

  /**
   * Gets info about the station as well as forward and previous stations for a specific station.
   */
  ngOnInit(): void {
    if (this.stationStatus !== MapItemStatus.Created) {
      this.getParams();
      this.getStationDocumentGenerationStatus(this.stationInformation.rithmId);

      this.stationService.stationName$
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (data) => {
            this.stationName = data.length > 0 ? data : 'Untitled Station';
          }, error: (error: unknown) => {
            this.errorService.displayError(
              'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
              error
            );
          }
        });
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
   * Whether the station is locally created on the map.
   *
   * @returns True if locally created, false otherwise.
   */
  get locallyCreated(): boolean {
    return this.stationStatus === MapItemStatus.Created;
  }

  /**
   * Get station document generation status.
   *
   * @param stationId The id of the station return status document.
   */
  getStationDocumentGenerationStatus(stationId: string): void {
    this.docGenLoading = true;
    this.stationService.getStationDocumentGenerationStatus(stationId)
      .pipe(first())
      .subscribe({
        next: (status: DocumentGenerationStatus) => {
          this.docGenLoading = false;
          if (status) {
            this.stationDocumentGenerationStatus = status;
          }
        }, error: (error: unknown) => {
          this.docGenLoading = false;
          this.showDocumentGenerationError = true;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Update station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @param statusNew The new status set in station document.
   */
  updateStationDocumentGenerationStatus(stationId: string, statusNew: DocumentGenerationStatus): void {
    this.docGenLoading = true;
    this.stationService.updateStationDocumentGenerationStatus(stationId, statusNew)
      .pipe(first())
      .subscribe({
        next: (status) => {
          this.docGenLoading = false;
          if (status) {
            this.stationDocumentGenerationStatus = status;
          }
        }, error: (error: unknown) => {
          this.docGenLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
        }
      });
  }

  /**
   * Attempts to retrieve the station info from the query params in the URL and make the requests.
   */
  private getParams(): void {
    this.route.params
      .pipe(first())
      .subscribe({
        next: (params) => {
          if (!params.stationId) {
            this.handleInvalidParams();
          } else {
            this.getLastUpdated(params.stationId);
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
   * Get the last updated date for a specific station.
   *
   * @param stationId The id of the station that the document is in.
   */
  getLastUpdated(stationId: string): void {
    this.stationLoading = true;
    this.lastUpdatedLoading = true;
    this.stationService.getLastUpdated(stationId)
      .pipe(first())
      .subscribe({
        next: (updatedDate) => {
          if (updatedDate && updatedDate !== 'Unknown') {
            this.lastUpdatedDate = this.utcTimeConversion.getElapsedTimeText(
              this.utcTimeConversion.getMillisecondsElapsed(updatedDate));
            this.colorMessage = 'text-accent-500';
            if (this.lastUpdatedDate === '1 day') {
              this.lastUpdatedDate = ' Yesterday';
            } else {
              this.lastUpdatedDate += ' ago';
            }
          } else {
            this.colorMessage = 'text-error-500';
            this.lastUpdatedDate = 'Unable to retrieve time';
          }
          this.stationLoading = false;
          this.lastUpdatedLoading = false;
        }, error: (error: unknown) => {
          this.colorMessage = 'text-error-500';
          this.lastUpdatedLoading = false;
          this.stationLoading = false;
          this.errorService.displayError(
            'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
            error
          );
          this.lastUpdatedDate = 'Unable to retrieve time';
          this.colorMessage = 'text-error-500';
        }
      });
  }

  /**
   * Navigates the user back to dashboard and displays a message about the invalid params.
   */
  private handleInvalidParams(): void {
    this.errorService.displayError(
      'Unable to retrieve the last updated time.',
      new Error('Invalid params for document')
    );
  }

  /**
   * This will delete the current station.
   *
   * @param stationId Target station to be deleted.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async deleteStation(stationId: string): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Are you sure?',
      message: 'The station will be deleted for everyone and any documents not moved to another station beforehand will be deleted.',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    });
    if (response) {
      this.stationService.deleteStation(stationId)
        .pipe(first())
        .subscribe({
          next: () => {
            this.popupService.notify('The station has been deleted.');
            this.router.navigateByUrl('dashboard');
          }, error: (error: unknown) => {
            this.errorService.displayError(
              'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
              error
            );
          }
        });
    }
  }

  /**
   * Update status the station.
   *
   * @param statusNew New status the station update.
   */
  updateStatusStation(statusNew: MatRadioChange): void {
    this.updateStationDocumentGenerationStatus(this.stationInformation.rithmId, statusNew.value);
  }

  /**
   * Get data about the station the document is in.
   *
   */
  getStationInfo(): void {
    this.stationLoading = true;
    if (this.stationStatus !== MapItemStatus.Created) {
      this.stationService.getStationInfo(this.stationInformation.rithmId)
        .pipe(first())
        .subscribe({
          next: (stationInfo) => {
            this.stationLoading = false;
            if (stationInfo) {
              this.stationInformation = stationInfo;
            }
          },
          error: (error: unknown) => {
            this.stationLoading = false;
            this.errorService.displayError(
              'Something went wrong on our end and we\'re looking into it. Please try again in a little while.',
              error
            );
          }
        });
    } else {
      this.stationLoading = false;
      //Is there any information for a new station that needs to be populated here?
    }
  }

  /**
   * Refresh the Info drawer after modal is close.
   *
   * @param event Result from closing roster management modal.
   */
  refreshInfoDrawer(event: boolean): void {
    if (event === true) {
      this.getStationInfo();
    }
  }

  /**
   * Handle required information for a locally created station.
   */
  newStationInit(): void {
    this.stationDocumentGenerationStatus = DocumentGenerationStatus.None;
    this.lastUpdatedDate = 'Publish Map changes to see last updated.';
  }

  /**
   * Navigate to station edit page upon confirmation in Map build mode and without any confirmation in Map view mode.
   *
   */
  async goToStation(): Promise<void> {
    let confirmNavigation = false;
    if (this.editMode) {
      const confirm = await this.popupService.confirm({
        title: 'Local Changes Not Saved',
        message: `Leave without publishing any changes made to the map?`,
        okButtonText: 'Proceed',
      });
      confirmNavigation = confirm;
    }
    if (confirmNavigation || !this.editMode) {
      this.router.navigate([`/station/${this.stationInformation.rithmId}`]);
    }
  }

}
