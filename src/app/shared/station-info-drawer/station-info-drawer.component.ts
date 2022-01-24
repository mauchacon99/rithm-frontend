import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { first, takeUntil } from 'rxjs/operators';
import { ErrorService } from 'src/app/core/error.service';
import { StationService } from 'src/app/core/station.service';
import { UtcTimeConversion } from 'src/helpers';
import { Router } from '@angular/router';
import { SidenavDrawerService } from 'src/app/core/sidenav-drawer.service';
import { UserService } from 'src/app/core/user.service';
import {
  DocumentGenerationStatus,
  MapItemStatus,
  MapMode,
  StationInfoDrawerData,
  StationInformation,
} from 'src/models';
import { PopupService } from 'src/app/core/popup.service';
import { MatRadioChange } from '@angular/material/radio';
import { MapService } from 'src/app/map/map.service';
import { DocumentService } from 'src/app/core/document.service';

/**
 * Component for info station.
 */
@Component({
  selector: 'app-station-info-drawer',
  templateUrl: './station-info-drawer.component.html',
  styleUrls: ['./station-info-drawer.component.scss'],
  providers: [UtcTimeConversion],
})
export class StationInfoDrawerComponent implements OnInit, OnDestroy {
  /** Subject for when the component is destroyed. */
  private destroyed$ = new Subject<void>();

  /** Whether the request to get the station info is currently underway. */
  stationLoading = true;

  /** Loading in last updated section. */
  lastUpdatedLoading = false;

  /** Loading in the document generation section. */
  docGenLoading = false;

  /** Loading in the document generation section. */
  docCreationLoading = false;

  /** Use to determinate generation of document. */
  showDocumentGenerationError = false;

  /** Is component viewed in station edit mode. */
  editMode = false;

  /** Station information object. */
  stationInformation?: StationInformation;

  /** Station Id passed from parent. */
  stationRithmId = '';

  /** Edit Mode. */
  stationName = '';

  /** Notes for the station. */
  stationNotes?: string;

  /** If component is being viewed on the map, what mode is the map in? */
  mapMode?: MapMode;

  /** If component is being viewed on the map, what status does the station have? */
  stationStatus?: MapItemStatus;

  /** The Last Updated Date. */
  lastUpdatedDate = '';

  /** Status by default the document in station. */
  stationDocumentGenerationStatus: DocumentGenerationStatus =
    DocumentGenerationStatus.None;

  /** Color message LastUpdated. */
  colorMessage = '';

  /** Whether the station drawer is opened from map or not. */
  openedFromMap = false;

  /** Allowing access to all MapMode enums in HTML.*/
  mapModeEnum = MapMode;

  /** The priority for current station once the info is loaded.*/
  stationPriority: number | '--' = '--';

  /** The default message to prompt user to publish local changes.*/
  publishStationMessage = 'Publish map changes to update ';

  /** The drawer context for stationInfo. */
  drawerContext = '';

  constructor(
    private sidenavDrawerService: SidenavDrawerService,
    private userService: UserService,
    private fb: FormBuilder,
    private stationService: StationService,
    private utcTimeConversion: UtcTimeConversion,
    private errorService: ErrorService,
    private popupService: PopupService,
    private router: Router,
    private mapService: MapService,
    private documentService: DocumentService
  ) {
    this.sidenavDrawerService.drawerContext$
      .pipe(takeUntil(this.destroyed$))
      .subscribe((data) => {
        this.drawerContext = data;
      });

    this.sidenavDrawerService.drawerData$
      .pipe(takeUntil(this.destroyed$))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .subscribe((data: any) => {
        const dataDrawer = data as StationInfoDrawerData;
        if (this.drawerContext === 'stationInfo') {
          if (dataDrawer) {
            this.editMode = dataDrawer.editMode;
            this.stationRithmId = dataDrawer.stationRithmId;
            this.stationName = dataDrawer.stationName;
            this.mapMode = dataDrawer.mapMode;
            this.stationStatus = dataDrawer.stationStatus;
            this.openedFromMap = dataDrawer.openedFromMap;
            this.stationNotes = dataDrawer.notes;
            if (
              this.openedFromMap &&
              this.stationStatus !== MapItemStatus.Created
            ) {
              this.getStationDocumentGenerationStatus();
            }
          } else {
            throw new Error('There was no station info drawer data');
          }
          this.getStationInfo();
        }
      });
  }

  /**
   * Gets info about the station as well as forward and previous stations for a specific station.
   */
  ngOnInit(): void {
    if (this.stationStatus !== MapItemStatus.Created) {
      this.getLastUpdated();
      this.getStationDocumentGenerationStatus();

      this.stationService.stationName$
        .pipe(takeUntil(this.destroyed$))
        .subscribe({
          next: (data) => {
            this.stationName = data.length > 0 ? data : 'Untitled Station';
          },
          error: (error: unknown) => {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    }
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
   */
  getStationDocumentGenerationStatus(): void {
    this.docGenLoading = true;
    this.stationService
      .getStationDocumentGenerationStatus(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (status: DocumentGenerationStatus) => {
          this.docGenLoading = false;
          if (status) {
            this.stationDocumentGenerationStatus = status;
          }
        },
        // eslint-disable-next-line
        error: (error: any) => {
          this.docGenLoading = false;
          this.showDocumentGenerationError = true;
          if (error?.status === 400) {
            this.sidenavDrawerService.closeDrawer();
          } else {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          }
        },
      });
  }

  /**
   * Update station document generation status.
   *
   * @param stationId The id of the station return status document.
   * @param statusNew The new status set in station document.
   */
  updateStationDocumentGenerationStatus(
    stationId: string,
    statusNew: DocumentGenerationStatus
  ): void {
    this.docGenLoading = true;
    this.stationService
      .updateStationDocumentGenerationStatus(stationId, statusNew)
      .pipe(first())
      .subscribe({
        next: (status) => {
          this.docGenLoading = false;
          if (status) {
            this.stationDocumentGenerationStatus = status;
          }
        },
        // eslint-disable-next-line
        error: (error: any) => {
          this.docGenLoading = false;
          if (error?.status === 400) {
            this.sidenavDrawerService.closeDrawer();
            // return;
          } else {
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          }
        },
      });
  }

  /**
   * Get the last updated date for a specific station.
   */
  getLastUpdated(): void {
    this.stationLoading = true;
    this.lastUpdatedLoading = true;
    this.stationService
      .getLastUpdated(this.stationRithmId)
      .pipe(first())
      .subscribe({
        next: (updatedDate) => {
          if (updatedDate && updatedDate !== 'Unknown') {
            this.lastUpdatedDate = this.utcTimeConversion.getElapsedTimeText(
              this.utcTimeConversion.getMillisecondsElapsed(updatedDate)
            );
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
          this.lastUpdatedLoading = false;
        },
        error: (error: unknown) => {
          this.colorMessage = 'text-error-500';
          this.lastUpdatedLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
          this.lastUpdatedDate = 'Unable to retrieve time';
          this.colorMessage = 'text-error-500';
        },
      });
  }

  /**
   * This will delete the current station.
   */
  async deleteStation(): Promise<void> {
    const response = await this.popupService.confirm({
      title: 'Are you sure?',
      message:
        'The station will be deleted for everyone and any documents not moved to another station beforehand will be deleted.',
      okButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      important: true,
    });
    if (response) {
      if (this.openedFromMap) {
        this.mapService.removeAllStationConnections(this.stationRithmId);
        this.mapService.deleteStation(this.stationRithmId);
        this.sidenavDrawerService.closeDrawer();
      } else {
        this.stationService
          .deleteStation(this.stationRithmId)
          .pipe(first())
          .subscribe({
            next: () => {
              this.popupService.notify('The station has been deleted.');
              this.router.navigateByUrl('dashboard');
            },
            error: (error: unknown) => {
              this.errorService.displayError(
                "Something went wrong on our end and we're looking into it. Please try again in a little while.",
                error
              );
            },
          });
      }
    }
  }

  /**
   * Update status the station.
   *
   * @param statusNew New status the station update.
   */
  updateStatusStation(statusNew: MatRadioChange): void {
    this.updateStationDocumentGenerationStatus(
      this.stationRithmId,
      statusNew.value
    );
  }

  /**
   * Get data about the station the document is in.
   *
   */
  getStationInfo(): void {
    this.stationLoading = true;
    if (this.stationStatus !== MapItemStatus.Created) {
      this.stationService
        .getStationInfo(this.stationRithmId)
        .pipe(first())
        .subscribe({
          next: (stationInfo) => {
            if (stationInfo) {
              this.stationInformation = stationInfo;
              this.stationPriority = stationInfo.priority;
            }
            this.stationLoading = false;
          },
          // eslint-disable-next-line
          error: (error: any) => {
            if (error?.status === 400) {
              this.sidenavDrawerService.closeDrawer();
            } else {
              this.stationLoading = false;
            }
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    } else {
      this.stationLoading = false;
      //Fill with blank station info if the station is newly created.
      this.stationInformation = {
        rithmId: this.stationRithmId,
        name: this.stationName,
        instructions: '',
        nextStations: [],
        previousStations: [],
        stationOwners: [],
        workers: [],
        createdByRithmId: '',
        createdDate: '',
        updatedByRithmId: '',
        updatedDate: '',
        questions: [],
        priority: 0,
      };
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
      this.router.navigate([`/station/${this.stationRithmId}`]);
    }
  }

  /**
   * Reporting if the name or notes on a station changed.
   */
  reportNewStationMapChange(): void {
    if (this.stationNotes === undefined) {
      throw new Error('Station notes not found');
    }
    const openStation = this.mapService.stationElements.find(
      (station) => this.stationRithmId === station.rithmId
    );
    if (openStation === undefined) {
      throw new Error('Station was not found.');
    }
    openStation.stationName = this.stationName;
    openStation.notes = this.stationNotes;
    openStation.markAsUpdated();
    this.mapService.stationElementsChanged$.next(true);
  }

  /**
   * Completes all subscriptions.
   */
  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  /**
   * Is the current user an owner or an admin for this station.
   *
   * @returns Validate if user is owner or admin of current station.
   */
  get isUserAdminOrOwner(): boolean {
    if (!this.stationInformation) {
      throw new Error(
        `The stationInformation is undefined when checking if user is admin or owner.`
      );
    }
    return (
      this.userService.isStationOwner(this.stationInformation) ||
      this.userService.isAdmin
    );
  }

  /**
   * Is the current user a worker on the station.
   *
   * @returns A boolean if user is worker on current station.
   */
  get isWorker(): boolean {
    if (!this.stationInformation) {
      throw new Error(
        `The stationInformation is undefined when checking if user is a worker.`
      );
    }
    return this.userService.isWorker(this.stationInformation);
  }

  /**
   * Open a modal to create a new document.
   */
  async createNewDocument(): Promise<void> {
    const confirm = await this.popupService.confirm({
      title: 'Are you sure?',
      message:
        'After the document is created you will be redirected to the document page.',
      okButtonText: 'Confirm',
      cancelButtonText: 'Cancel',
    });
    if (confirm) {
      this.docCreationLoading = true;
      this.documentService
        .createNewDocument('', 0, this.stationRithmId)
        .pipe(first())
        .subscribe({
          next: (documentId) => {
            this.popupService.notify(
              'The document has been created successfully.'
            );
            this.router.navigateByUrl(`/document/${documentId}?documentId=${documentId}&stationId=${this.stationRithmId}`);
          },
          error: (error: unknown) => {
            this.docCreationLoading = false;
            this.errorService.displayError(
              "Something went wrong on our end and we're looking into it. Please try again in a little while.",
              error
            );
          },
        });
    }
  }

  /**
   * Assign an user to a document.
   *
   * @param userRithmId The Specific id of user assign.
   * @param documentRithmId The Specific id of document.
   */
  assignUserToDocument(userRithmId: string, documentRithmId: string): void {
    this.documentService
      .assignUserToDocument(userRithmId, this.stationRithmId, documentRithmId)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate([`/document/${documentRithmId}`], {
            queryParams: {
              documentId: documentRithmId,
              stationId: this.stationRithmId,
            },
          });
          this.docCreationLoading = false;
        },
        error: (error: unknown) => {
          this.docCreationLoading = false;
          this.errorService.displayError(
            "Something went wrong on our end and we're looking into it. Please try again in a little while.",
            error
          );
        },
      });
  }
}
